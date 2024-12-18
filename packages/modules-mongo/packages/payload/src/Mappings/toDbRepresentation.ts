import type { JsonObject } from '@xylabs/object'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { isBoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'

import type { BoundWitnessMongoMeta } from '../BoundWitness/index.js'
import type { PayloadWithMongoMeta } from '../Payload/index.js'

export const payloadToDbRepresentation = async <T extends Payload>(payload: T): Promise<PayloadWithMongoMeta<T>> => {
  const clone: JsonObject = structuredClone(payload) as unknown as JsonObject
  const metaNormalized: JsonObject = {}
  for (const key of Object.keys(clone)) {
    if (key.startsWith('$')) {
      metaNormalized[`_${key}`] = clone[key]
    } else {
      metaNormalized[key] = clone[key]
    }
  }
  return (await PayloadBuilder.addStorageMeta(metaNormalized as unknown as PayloadWithMongoMeta<T>))
}

export const boundWitnessToDbRepresentation = async <T extends BoundWitness>(bw: T): Promise<BoundWitnessMongoMeta<T>> => {
  return (await payloadToDbRepresentation(bw)) as BoundWitnessMongoMeta<T>
}

export const toDbRepresentation = <T extends Payload | BoundWitness>(value: T) => {
  return isBoundWitness(value) ? boundWitnessToDbRepresentation(value) : payloadToDbRepresentation(value)
}
