import { BoundWitness } from '@xyo-network/boundwitness-model'
import { deepOmitPrefixedFields } from '@xyo-network/hash'
import { Payload, PayloadMetaFields } from '@xyo-network/payload-model'
import { BoundWitnessWithMongoMeta, PayloadWithMongoMeta } from '@xyo-network/payload-mongodb'

export const toReturnValue = <
  T = PayloadWithMongoMeta | BoundWitnessWithMongoMeta,
  U = T extends PayloadWithMongoMeta ? Payload<PayloadMetaFields> : BoundWitness,
>(
  value: T,
): U => {
  const { _$hash, _$meta, ...other } = value as PayloadWithMongoMeta
  const sanitized = deepOmitPrefixedFields(other, '_')
  return { $hash: _$hash, $meta: _$meta, ...sanitized } as U
}
