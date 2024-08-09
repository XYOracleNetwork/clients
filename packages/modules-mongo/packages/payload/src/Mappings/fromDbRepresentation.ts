import { assertEx } from '@xylabs/assert'
import { omitBy } from '@xylabs/lodash'
import { BoundWitness, BoundWitnessFields, isBoundWitness } from '@xyo-network/boundwitness-model'
import { Payload, PayloadMetaFields } from '@xyo-network/payload-model'

import { BoundWitnessWithMongoMeta } from '../BoundWitness/index.js'
import { PayloadWithMongoMeta } from '../Payload/index.js'

const omitByPredicate = (prefix: string) => (_: unknown, key: string) => {
  assertEx(typeof key === 'string', () => `Invalid key type [${key}, ${typeof key}]`)
  return key.startsWith(prefix)
}

export const payloadFromDbRepresentation = (value: PayloadWithMongoMeta): Payload<PayloadMetaFields> => {
  const { _$hash, _$meta, ...other } = value
  const sanitized = omitBy(other, omitByPredicate('_'))
  return { ...sanitized, $hash: _$hash, $meta: _$meta } as Payload<PayloadMetaFields>
}

export const boundWitnessFromDbRepresentation = (value: BoundWitnessWithMongoMeta): BoundWitness<BoundWitnessFields> => {
  const { _$hash, _$meta, ...other } = value
  const sanitized = omitBy(other, omitByPredicate('_'))
  return { ...sanitized, $hash: _$hash, $meta: _$meta } as unknown as BoundWitness<BoundWitnessFields>
}

export const fromDbRepresentation = <T = PayloadWithMongoMeta | BoundWitnessWithMongoMeta>(value: T) => {
  return isBoundWitness(value)
    ? (boundWitnessFromDbRepresentation(value as unknown as BoundWitnessWithMongoMeta) as BoundWitness<BoundWitnessFields>)
    : (payloadFromDbRepresentation(value as PayloadWithMongoMeta) as Payload<PayloadMetaFields>)
}
