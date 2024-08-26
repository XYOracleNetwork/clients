import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import type { PayloadWithMongoMeta } from '@xyo-network/payload-mongodb'

export const toPayloadWithMongoMeta = async <T extends Payload>(payload: T): Promise<PayloadWithMongoMeta<T>> => {
  const built = await PayloadBuilder.build(payload)
  const _hash = await PayloadBuilder.hash(built)
  const {
    $hash, $meta, ...fields
  } = built
  return {
    ...fields, _$hash: $hash, _$meta: $meta, _hash, _timestamp: Date.now(),
  } as unknown as PayloadWithMongoMeta<T>
}
