import { PayloadHasher } from '@xyo-network/core'
import type {
  BoundWitnessMeta,
  BoundWitnessWithMeta,
  BoundWitnessWithPartialMeta,
  PayloadMeta,
  PayloadWithMeta,
  PayloadWithPartialMeta,
} from '@xyo-network/payload-mongodb'

export async function augmentWithMetadata(
  payloads: BoundWitnessWithPartialMeta[],
  meta: BoundWitnessMeta,
): Promise<BoundWitnessWithMeta[]>
export async function augmentWithMetadata(
  payloads: PayloadWithPartialMeta[],
  meta: PayloadMeta,
): Promise<PayloadWithMeta[]>
export async function augmentWithMetadata(
  payloads: PayloadWithPartialMeta[],
  meta: PayloadMeta,
): Promise<PayloadWithMeta[]> {
  const result = await Promise.all(
    payloads.map(async (payload) => {
      return {
        ...payload,
        ...meta,
        _hash: await PayloadHasher.hashAsync(payload),
      }
    }),
  )
  return result
}