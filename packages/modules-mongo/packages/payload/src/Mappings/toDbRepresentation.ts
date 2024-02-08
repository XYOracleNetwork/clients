import { BoundWitness, isBoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload } from '@xyo-network/payload-model'

import { BoundWitnessMongoMeta } from '../BoundWitness'
import { PayloadWithMongoMeta } from '../Payload'

// export const toPayloadWithMongoMeta = async <T extends Payload>(payload: T): Promise<PayloadWithMongoMeta<T>> => {
//   const built = await PayloadBuilder.build(payload)
//   const _hash = await PayloadBuilder.hash(built)
//   const { $hash, $meta, ...fields } = built
//   return { ...fields, _$hash: $hash, _$meta: $meta, _hash, _timestamp: Date.now() } as PayloadWithMongoMeta<T>
// }

export const payloadToDbRepresentation = async <T extends Payload>(payload: T): Promise<PayloadWithMongoMeta<T>> => {
  const built = await PayloadBuilder.build(payload)
  const _hash = await PayloadBuilder.hash(built)
  const { $hash, $meta, ...fields } = built
  return { ...fields, _$hash: $hash, _$meta: $meta, _hash, _timestamp: Date.now() } as PayloadWithMongoMeta<T>
}

export const boundWitnessToDbRepresentation = async <T extends BoundWitness>(payload: T): Promise<BoundWitnessMongoMeta<T>> => {
  const built = await PayloadBuilder.build(payload)
  const _hash = await PayloadBuilder.hash(built)
  const { $hash, $meta, ...fields } = built
  return { ...fields, _$hash: $hash, _$meta: $meta, _hash, _timestamp: Date.now() } as unknown as BoundWitnessMongoMeta<T>
}

export const toDbRepresentation = <T extends Payload | BoundWitness>(value: T) => {
  return isBoundWitness(value) ? boundWitnessToDbRepresentation(value) : payloadToDbRepresentation(value)
}
