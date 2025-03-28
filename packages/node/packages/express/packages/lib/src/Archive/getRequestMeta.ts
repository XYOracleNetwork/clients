import { getHttpHeader } from '@xylabs/express'
import type { BoundWitnessMongoMeta, PayloadMongoMeta } from '@xyo-network/payload-mongodb'
import type { Request } from 'express'

export type RequestWithArchive = {
  archive?: string
}

export const getRequestMeta = <T extends RequestWithArchive>(req: Request<T>): [BoundWitnessMongoMeta, PayloadMongoMeta] => {
  const __source_ip = req.ip ?? undefined
  const __timestamp = Date.now()
  const __user_agent = getHttpHeader('User-agent', req) || undefined
  const boundWitnessMetaData: Partial<BoundWitnessMongoMeta> = {
    __source_ip,
    __user_agent,
  }
  const payloadMetaData: Partial<PayloadMongoMeta> = { __timestamp }
  return [boundWitnessMetaData as BoundWitnessMongoMeta, payloadMetaData as PayloadMongoMeta]
}
