import type { JsonObject } from '@xylabs/object'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { isBoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'

import type { BoundWitnessMongoMeta } from '../BoundWitness/index.js'
import type { PayloadWithMongoMeta } from '../Payload/index.js'

export const payloadToDbRepresentation = async <T extends Payload>(payload: T, index = 0): Promise<PayloadWithMongoMeta<T>> => {
  const clone: JsonObject = structuredClone(payload) as unknown as JsonObject
  const _$hash = await PayloadBuilder.hash(payload)
  const _hash = await PayloadBuilder.dataHash(payload)
  const metaNormalized: JsonObject = {}
  for (const key of Object.keys(clone)) {
    if (key.startsWith('$')) {
      metaNormalized[`_${key}`] = clone[key]
    } else {
      metaNormalized[key] = clone[key]
    }
  }
  return {
    ...metaNormalized, _hash, _$hash, _timestamp: Date.now() + index,
  } as PayloadWithMongoMeta<T>
}

export const boundWitnessToDbRepresentation = async <T extends BoundWitness>(bw: T, index = 0): Promise<BoundWitnessMongoMeta<T>> => {
  return (await payloadToDbRepresentation(bw, index)) as BoundWitnessMongoMeta<T>
}

export const toDbRepresentation = <T extends Payload | BoundWitness>(value: T, index = 0) => {
  return isBoundWitness(value) ? boundWitnessToDbRepresentation(value, index) : payloadToDbRepresentation(value, index)
}
