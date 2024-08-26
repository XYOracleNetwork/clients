import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import type { DomainPayload } from '@xyo-network/domain-payload-plugin'
import { DomainPayloadWrapper } from '@xyo-network/domain-payload-plugin'
import type { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

export type DomainPathParams = {
  domain: string
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const handler: RequestHandler<DomainPathParams, DomainPayload> = async (req, res, next) => {
  const { domain } = req.params
  const config = await DomainPayloadWrapper.discover(domain)
  if (config) {
    res.json(config.payload)
  } else {
    next({ message: 'Config not found', statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getDomain = asyncHandler(handler)
