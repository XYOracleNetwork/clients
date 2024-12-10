import type { JsonObject } from '@xylabs/object'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { isBoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'

import type { BoundWitnessWithMongoMeta } from '../BoundWitness/index.js'
import type { PayloadWithMongoMeta } from '../Payload/index.js'

export const payloadFromDbRepresentation = (value: PayloadWithMongoMeta): Payload => {
  const clone: JsonObject = structuredClone(value) as unknown as JsonObject
  const metaNormalized: JsonObject = {}
  for (const key of Object.keys(clone)) {
    if (key.startsWith('_$')) {
      // remove _ from _$ fields
      metaNormalized[key.slice(1)] = clone[key]
    } else {
      metaNormalized[key] = clone[key]
    }
  }
  return PayloadBuilder.omitStorageMeta(metaNormalized as unknown as Payload)
}

export const boundWitnessFromDbRepresentation = (value: BoundWitnessWithMongoMeta): BoundWitness => {
  return payloadFromDbRepresentation(value) as unknown as BoundWitness
}

export const fromDbRepresentation = <T = PayloadWithMongoMeta | BoundWitnessWithMongoMeta>(value: T) => {
  return isBoundWitness(value)
    ? (boundWitnessFromDbRepresentation(value as unknown as BoundWitnessWithMongoMeta))
    : (payloadFromDbRepresentation(value as PayloadWithMongoMeta))
}
