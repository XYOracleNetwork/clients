import { assertEx } from '@xylabs/assert'
import { type Address, asAddress } from '@xylabs/hex'
import type { JsonObject } from '@xylabs/object'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { isQueryBoundWitness, type QueryBoundWitness } from '@xyo-network/boundwitness-model'
import { ModuleErrorBuilder } from '@xyo-network/module-abstract'
import type { Module, ModuleQueryResult } from '@xyo-network/module-model'
import { trimAddressPrefix } from '@xyo-network/node-core-lib'
import type { ModuleError, Payload } from '@xyo-network/payload-model'
import type { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import type { AddressPathParams } from '../AddressPathParams.js'
import { getQueryConfig } from './getQueryConfig.js'

export type PostAddressRequestBody = [QueryBoundWitness, undefined | Payload[]]

/* const dumpModulesDown = async (module: ModuleInstance, maxDepth = 10) => {
  const padding = Array(10 - maxDepth)
    .fill('--')
    .join('')
  console.log(padding, module.address, `[${module.id}]`)
  const children = (await module.resolve('*', { direction: 'down', maxDepth: 3, visibility: 'public' })).filter(
    (mod) => mod.address !== module.address,
  )
  for (const child of children) {
    await dumpModulesDown(child, maxDepth - 1)
  }
} */

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const handler: RequestHandler<AddressPathParams, ModuleQueryResult | ModuleError, PostAddressRequestBody> = async (req, res, next) => {
  const returnError = async (code: number, message = 'An error occurred', details?: JsonObject) => {
    const error = await new ModuleErrorBuilder().message(message).details(details).build()
    res.locals.rawResponse = false
    res.status(code).json(error)
    next()
  }

  const { address } = req.params
  const { node } = req.app
  const [bw, payloads] = Array.isArray(req.body) ? req.body : []
  if (!address) {
    return await returnError(StatusCodes.BAD_REQUEST, 'Missing address')
  }

  if (!bw) {
    return await returnError(StatusCodes.BAD_REQUEST, 'Missing boundwitness')
  }

  if (!isQueryBoundWitness(bw)) {
    return await returnError(StatusCodes.BAD_REQUEST, 'Invalid query boundwitness')
  }

  let modules: Module[] = []
  const normalizedAddress = trimAddressPrefix(address).toLowerCase() as Address
  if (node.address === normalizedAddress) modules = [node]
  else {
    const typedAddress = asAddress(address)
    const byAddress = typedAddress ? await node.resolve(typedAddress, { maxDepth: 10 }) : undefined

    if (byAddress) modules = [byAddress]
    else {
      const byName = await node.resolve(address, { direction: 'down' })
      if (byName) {
        const moduleAddress = assertEx(byName?.address, () => 'Error redirecting to module by address')
        // console.log(`address post[${node.address}]: ${address} [redirect]`)
        res.redirect(StatusCodes.TEMPORARY_REDIRECT, `/${moduleAddress}`)
        return
      } else {
        return await returnError(StatusCodes.NOT_FOUND, 'Module not found', { address })
      }
    }
  }

  if (modules.length > 0) {
    const mod = modules[0]
    const queryConfig = await getQueryConfig(mod, req, bw, payloads)
    // console.warn(`bw: ${JSON.stringify(bw, null, 2)}`)
    try {
      const queryResult = await mod.query(bw, payloads, queryConfig)
      // console.log(`address post[${node.address}]: ${address} [${queryResult.length}]`)
      // console.warn(`queryResult0: ${JSON.stringify(queryResult[0], null, 2)}`)
      // console.warn(`queryResult1: ${JSON.stringify(queryResult[1], null, 2)}`)
      res.json(queryResult)
    } catch (ex) {
      return await returnError(StatusCodes.INTERNAL_SERVER_ERROR, 'Query Failed', { message: (ex as Error)?.message ?? 'Unknown Error' })
    }
    return
  } else {
    await returnError(StatusCodes.NOT_FOUND, 'Module not found', { address })
  }
}

export const postAddress = asyncHandler(handler)
