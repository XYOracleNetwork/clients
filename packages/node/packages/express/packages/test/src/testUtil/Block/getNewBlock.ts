import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'

import { unitTestSigningAccount } from '../Account/index.js'
import { getNewPayloads } from '../Payload/index.js'

export const getNewBlock = async (...payloads: Payload[]): Promise<[BoundWitness, Payload[]]> => {
  const [bw, p] = await new BoundWitnessBuilder().signer(await unitTestSigningAccount()).payloads(payloads).build()
  return [bw, p]
}

export const getNewBlockWithPayloads = async (numPayloads = 1): Promise<[BoundWitness, Payload[]]> => {
  const blocksWithPayloads = await getNewBlocksWithPayloads(numPayloads)
  const [bw, payloads] = blocksWithPayloads[0]
  return [bw, payloads]
}

export const getNewBlocks = async (numBoundWitnesses = 1): Promise<BoundWitness[]> => {
  const blocksWithPayloads = await getNewBlocksWithPayloads(numBoundWitnesses)
  return blocksWithPayloads.map(([block]) => block)
}

export const getNewBlocksWithPayloads = async (
  numBoundWitnesses = 1,
  numPayloads = 1,
): Promise<[BoundWitness, Payload[]][]> => {
  return await Promise.all(
    Array.from({ length: numBoundWitnesses })
      .map(async () => {
        const result = await (new BoundWitnessBuilder().signer(await unitTestSigningAccount()).payloads(await getNewPayloads(numPayloads))).build()
        return [result[0], result[1]]
      }),
  )
}
