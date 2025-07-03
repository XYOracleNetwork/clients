import { assertEx } from '@xylabs/assert'
import { asyncHandler } from '@xylabs/express'
import { asAddress } from '@xylabs/hex'
import { isModuleIdentifierPart } from '@xyo-network/module-model'
import { trimAddressPrefix } from '@xyo-network/node-core-lib'
import type { Payload } from '@xyo-network/payload-model'
import type { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import type { AddressPathParams } from '../AddressPathParams.ts'

const handler: RequestHandler<AddressPathParams, Payload[]> = async (req, res, next) => {
  const { address: rawAddress } = req.params
  const { node } = req.app
  const address = asAddress(rawAddress)
  if (address) {
    let mod = node.address === address ? node : (await node.resolve(address, { direction: 'down' }))
    if (mod) {
      res.json(await mod.state())
      return
    }
  }
  if (isModuleIdentifierPart(rawAddress)) {
    const moduleIdentifier = trimAddressPrefix(rawAddress)
    const mod = await node.resolve(moduleIdentifier, { direction: 'down' })
    if (mod) {
      const moduleAddress = assertEx(mod?.address, () => 'Error redirecting to module by address')
      res.redirect(StatusCodes.MOVED_TEMPORARILY, `/${moduleAddress}`)
      return
    }
  }
  next('route')
}

export const getAddress = asyncHandler(handler)
