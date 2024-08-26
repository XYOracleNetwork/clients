import { assertEx } from '@xylabs/assert'
import type { Address } from '@xylabs/hex'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import type { ModuleInstance } from '@xyo-network/module-model'
import { trimAddressPrefix } from '@xyo-network/node-core-lib'
import type { Payload } from '@xyo-network/payload-model'
import type { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import type { AddressPathParams } from '../AddressPathParams.js'

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const handler: RequestHandler<AddressPathParams, Payload[]> = async (req, res, next) => {
  const { address } = req.params
  const { node } = req.app
  if (address) {
    let modules: ModuleInstance[] = []
    const normalizedAddress = trimAddressPrefix(address).toLowerCase() as Address
    if (node.address === normalizedAddress) modules = [node]
    else {
      const byAddress = await node.resolve({ address: [normalizedAddress] }, { direction: 'down' })
      if (byAddress.length > 0) modules = byAddress
      else {
        const byName = await node.resolve({ name: [address] }, { direction: 'down' })
        if (byName.length > 0) {
          const moduleAddress = assertEx(byName.pop()?.address, () => 'Error redirecting to module by address')
          res.redirect(StatusCodes.MOVED_TEMPORARILY, `/${moduleAddress}`)
          return
        }
      }
    }
    if (modules.length > 0) {
      const mod = modules[0]
      res.json(await mod.state())
      return
    }
  }
  next('route')
}

export const getAddress = asyncHandler(handler)
