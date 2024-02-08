import { deepOmitPrefixedFields } from '@xyo-network/hash'
import { Payload, PayloadMetaFields } from '@xyo-network/payload-model'
import { BoundWitnessWithMongoMeta, PayloadWithMongoMeta } from '@xyo-network/payload-mongodb'

export const toReturnValue = (value: PayloadWithMongoMeta | BoundWitnessWithMongoMeta): Payload<PayloadMetaFields> => {
  const { _$hash, _$meta, ...other } = value
  const sanitized = deepOmitPrefixedFields(other, '_')
  return { $hash: _$hash, $meta: _$meta, ...sanitized } as Payload<PayloadMetaFields>
}
