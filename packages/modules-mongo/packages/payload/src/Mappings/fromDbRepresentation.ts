import { BoundWitness, BoundWitnessFields, isBoundWitness } from '@xyo-network/boundwitness-model'
import { deepOmitPrefixedFields } from '@xyo-network/hash'
import { Payload, PayloadMetaFields } from '@xyo-network/payload-model'

import { BoundWitnessWithMongoMeta } from '../BoundWitness'
import { PayloadWithMongoMeta } from '../Payload'

// export const toReturnValue = <
//   T = PayloadWithMongoMeta | BoundWitnessWithMongoMeta,
//   U = T extends PayloadWithMongoMeta ? Payload<PayloadMetaFields> : BoundWitness,
// >(
//   value: T,
// ): U => {
//   const { _$hash, _$meta, ...other } = value as PayloadWithMongoMeta
//   const sanitized = deepOmitPrefixedFields(other, '_')
//   return { $hash: _$hash, $meta: _$meta, ...sanitized } as U
// }

export const payloadFromDbRepresentation = (value: PayloadWithMongoMeta): Payload<PayloadMetaFields> => {
  const { _$hash, _$meta, ...other } = value
  const sanitized = deepOmitPrefixedFields(other, '_')
  return { ...sanitized, $hash: _$hash, $meta: _$meta }
}

export const boundWitnessFromDbRepresentation = (value: BoundWitnessWithMongoMeta): BoundWitness<BoundWitnessFields> => {
  const { _$hash, _$meta, ...other } = value
  const sanitized = deepOmitPrefixedFields(other, '_')
  return { ...sanitized, $hash: _$hash, $meta: _$meta } as unknown as BoundWitness<BoundWitnessFields>
}

export const fromDbRepresentation = <T = PayloadWithMongoMeta | BoundWitnessWithMongoMeta>(value: T) => {
  return isBoundWitness(value)
    ? (boundWitnessFromDbRepresentation(value as unknown as BoundWitnessWithMongoMeta) as BoundWitness<BoundWitnessFields>)
    : (payloadFromDbRepresentation(value as PayloadWithMongoMeta) as Payload<PayloadMetaFields>)
}
