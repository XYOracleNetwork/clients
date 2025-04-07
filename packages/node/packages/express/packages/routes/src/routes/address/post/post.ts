import { assertEx } from '@xylabs/assert'
import { asyncHandler } from '@xylabs/express'
import { type Address, asAddress } from '@xylabs/hex'
import type { JsonObject } from '@xylabs/object'
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

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const handler: RequestHandler<AddressPathParams, ModuleQueryResult | ModuleError, PostAddressRequestBody> = async (req, res, next) => {
  const returnError = (code: number, message = 'An error occurred', details?: JsonObject) => {
    const error = new ModuleErrorBuilder().message(message).details(details).build()
    res.locals.rawResponse = false
    res.status(code).json(error)
    next()
  }

  const { address } = req.params
  const { node } = req.app
  const [bw, payloads] = Array.isArray(req.body) ? req.body : []
  if (!address) {
    return returnError(StatusCodes.BAD_REQUEST, 'Missing address')
  }

  if (!bw) {
    return returnError(StatusCodes.BAD_REQUEST, 'Missing boundwitness')
  }

  if (!isQueryBoundWitness(bw)) {
    return returnError(StatusCodes.BAD_REQUEST, 'Invalid query boundwitness')
  }

  let modules: Module[] = []
  const normalizedAddress = trimAddressPrefix(address) as Address
  if (node.address === normalizedAddress) modules = [node]
  else {
    const typedAddress = asAddress(address)
    const byAddress = typedAddress ? await node.resolve(typedAddress, { maxDepth: 10 }) : undefined

    if (byAddress) modules = [byAddress]
    else {
      const byName = await node.resolve(address, { direction: 'down' })
      if (byName) {
        const moduleAddress = assertEx(byName?.address, () => 'Error redirecting to module by address')
        res.redirect(StatusCodes.TEMPORARY_REDIRECT, `/${moduleAddress}`)
        return
      } else {
        return returnError(StatusCodes.NOT_FOUND, 'Module not found', { address })
      }
    }
  }

  if (modules.length > 0) {
    const mod = modules[0]
    const queryConfig = await getQueryConfig(mod, req, bw, payloads)
    try {
      const queryResult = await mod.query(bw, payloads, queryConfig)
      res.json(queryResult)
    } catch (ex) {
      return returnError(StatusCodes.INTERNAL_SERVER_ERROR, 'Query Failed', { message: (ex as Error)?.message ?? 'Unknown Error' })
    }
  } else {
    return returnError(StatusCodes.NOT_FOUND, 'Module not found', { address })
  }
}

export const postAddress = asyncHandler(handler)
