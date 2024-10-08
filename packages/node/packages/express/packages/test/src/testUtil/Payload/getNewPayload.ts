import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import { v4 as uuid } from 'uuid'

import { knownPayloadPromise } from './getKnownPayload.js'
import { schema } from './schema.js'

export const getNewPayload = async (): Promise<Payload> => {
  const knownPayload = await knownPayloadPromise
  const fields = { ...knownPayload, uid: uuid() }
  const result = await new PayloadBuilder({ schema }).fields(fields).build()
  return result
}

export const getNewPayloads = async (numPayloads: number) => {
  return await Promise.all(Array.from({ length: numPayloads }).fill(0).map(getNewPayload))
}
