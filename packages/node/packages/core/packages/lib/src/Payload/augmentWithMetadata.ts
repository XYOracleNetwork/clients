import { PayloadBuilder } from '@xyo-network/payload-builder'
import type {
  BoundWitnessMongoMeta,
  BoundWitnessWithMongoMeta,
  BoundWitnessWithPartialMongoMeta,
  PayloadMongoMeta,
  PayloadWithMongoMeta,
  PayloadWithPartialMongoMeta,
} from '@xyo-network/payload-mongodb'

export async function augmentWithStorageMetadata(
  payloads: BoundWitnessWithPartialMongoMeta[],
  meta: BoundWitnessMongoMeta,
): Promise<BoundWitnessWithMongoMeta[]>
export async function augmentWithStorageMetadata(payloads: PayloadWithPartialMongoMeta[], meta: PayloadMongoMeta): Promise<PayloadWithMongoMeta[]>
export async function augmentWithStorageMetadata(payloads: PayloadWithPartialMongoMeta[], meta: PayloadMongoMeta): Promise<PayloadWithMongoMeta[]> {
  const result = await Promise.all(
    payloads.map(async (payload) => {
      return {
        ...payload,
        ...meta,
        _hash: await PayloadBuilder.dataHash(payload),
      }
    }),
  )
  return result
}
