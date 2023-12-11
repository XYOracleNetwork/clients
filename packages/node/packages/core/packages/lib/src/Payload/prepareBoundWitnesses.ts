import type {
  BoundWitnessMeta,
  BoundWitnessWithMeta,
  BoundWitnessWithPartialMeta,
  PayloadMeta,
  PayloadWithMeta,
  PayloadWithPartialMeta,
} from '@xyo-network/payload-mongodb'
import { BoundWitnessMapResult, flatMapBoundWitness } from '@xyo-network/payload-mongodb'

import { augmentWithMetadata } from './augmentWithMetadata'
import { removeMetaPayloads } from './removeMetaPayloads'

export interface PrepareBoundWitnessesResult {
  payloads: PayloadWithMeta[]
  sanitized: BoundWitnessWithMeta[]
}

export const prepareBoundWitnesses = async (
  boundWitnesses: BoundWitnessWithPartialMeta[],
  boundWitnessMetaData: BoundWitnessMeta,
  payloadMetaData: PayloadMeta,
): Promise<PrepareBoundWitnessesResult> => {
  const flattened: BoundWitnessMapResult = boundWitnesses
    .map(flatMapBoundWitness)
    .reduce((prev, curr) => [prev[0].concat(curr[0]), prev[1].concat(curr[1])], [[], []])
  const rawBoundWitnesses: BoundWitnessWithPartialMeta[] = flattened[0]
  const rawPayloads: PayloadWithPartialMeta[] = flattened[1]
  const boundWitnessesWithMeta: BoundWitnessWithMeta[] = await augmentWithMetadata(rawBoundWitnesses, boundWitnessMetaData)
  const sanitized: BoundWitnessWithMeta[] = removeMetaPayloads(boundWitnessesWithMeta)
  const payloads: PayloadWithMeta[] = await augmentWithMetadata(rawPayloads, payloadMetaData)
  return { payloads, sanitized }
}
