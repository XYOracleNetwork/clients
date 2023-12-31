import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload } from '@xyo-network/payload-model'
import { v4 as uuid } from 'uuid'

import { knownPayloadPromise } from './getKnownPayload'
import { schema } from './schema'

export const getNewPayload = async (): Promise<Payload> => {
  const fields = { ...(await knownPayloadPromise), uid: uuid() }
  return await new PayloadBuilder({ schema }).fields(fields).build()
}

export const getNewPayloads = async (numPayloads: number) => {
  return await Promise.all(new Array(numPayloads).fill(0).map(getNewPayload))
}
