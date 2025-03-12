import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import { v4 as uuid } from 'uuid'

import { knownPayload } from './getKnownPayload.js'
import { schema } from './schema.js'

export const getNewPayload = (): Payload => {
  const fields = { ...knownPayload, uid: uuid() }
  const result = new PayloadBuilder({ schema }).fields(fields).build()
  return result
}

export const getNewPayloads = (numPayloads: number) => {
  return Array.from({ length: numPayloads }).fill(0).map(getNewPayload)
}
