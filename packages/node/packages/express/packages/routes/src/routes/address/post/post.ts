import { assertEx } from '@xylabs/assert'
import { Address } from '@xylabs/hex'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { QueryBoundWitness } from '@xyo-network/boundwitness-model'
import { Module, ModuleQueryResult } from '@xyo-network/module-model'
import { trimAddressPrefix } from '@xyo-network/node-core-lib'
import { Payload } from '@xyo-network/payload-model'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { AddressPathParams } from '../AddressPathParams'
import { getQueryConfig } from './getQueryConfig'

export type PostAddressRequestBody = [QueryBoundWitness, undefined | Payload[]]

/*const dumpModulesDown = async (module: ModuleInstance, maxDepth = 10) => {
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
}*/

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const handler: RequestHandler<AddressPathParams, ModuleQueryResult, PostAddressRequestBody> = async (req, res, next) => {
  const { address } = req.params
  const { node } = req.app
  //console.log(`address post[${node.address}]: ${address}`)
  //console.log('\nManifest')
  //console.log(JSON.stringify(await node.manifest(), null, 2))
  //console.log('\nDump')
  //await dumpModulesDown(node)
  const [bw, payloads] = Array.isArray(req.body) ? req.body : []
  if (address && bw) {
    let modules: Module[] = []
    const normalizedAddress = trimAddressPrefix(address).toLowerCase() as Address
    if (node.address === normalizedAddress) modules = [node]
    else {
      const byAddress = await node.resolve(address, { maxDepth: 10 })
      /*
      if (!byAddress) {
        console.log(`address post handler: ${address} - not found`)
      }
      */
      if (byAddress) modules = [byAddress]
      else {
        const byName = await node.resolve({ name: [address] }, { direction: 'down' })
        if (byName.length > 0) {
          const moduleAddress = assertEx(byName.pop()?.address, () => 'Error redirecting to module by address')
          //console.log(`address post[${node.address}]: ${address} [redirect]`)
          res.redirect(StatusCodes.TEMPORARY_REDIRECT, `/${moduleAddress}`)
          return
        }
      }
    }
    if (modules.length > 0) {
      const mod = modules[0]
      const queryConfig = await getQueryConfig(mod, req, bw, payloads)
      const queryResult = await mod.query(bw, payloads, queryConfig)
      //console.log(`address post[${node.address}]: ${address} [${queryResult.length}]`)
      res.json(queryResult)
      return
    }
  }

  //console.log(`address post[${node.address}]: ${address} [404]`)
  // TODO: Return 404 instead?
  next('route')
}

export const postAddress = asyncHandler(handler)
