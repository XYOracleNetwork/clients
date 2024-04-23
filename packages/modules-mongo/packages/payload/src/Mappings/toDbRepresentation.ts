import { BoundWitness, isBoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload } from '@xyo-network/payload-model'

import { BoundWitnessMongoMeta } from '../BoundWitness'
import { PayloadWithMongoMeta } from '../Payload'

export const payloadToDbRepresentation = async <T extends Payload>(payload: T, index = 0): Promise<PayloadWithMongoMeta<T>> => {
  const built = await PayloadBuilder.build(payload)
  const _hash = await PayloadBuilder.hash(built)
  const { $hash, $meta, ...fields } = built
  return { ...fields, _$hash: $hash, _$meta: $meta, _hash, _timestamp: Date.now() + index } as unknown as PayloadWithMongoMeta<T>
}

export const boundWitnessToDbRepresentation = async <T extends BoundWitness>(bw: T, index = 0): Promise<BoundWitnessMongoMeta<T>> => {
  const built = await PayloadBuilder.build(bw)
  const _hash = await PayloadBuilder.hash(built)
  const { $hash, $meta, ...fields } = built
  return { ...fields, _$hash: $hash, _$meta: $meta, _hash, _timestamp: bw.timestamp ?? Date.now() + index } as unknown as BoundWitnessMongoMeta<T>
}

export const toDbRepresentation = <T extends Payload | BoundWitness>(value: T, index = 0) => {
  return isBoundWitness(value) ? boundWitnessToDbRepresentation(value, index) : payloadToDbRepresentation(value, index)
}
