import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'

import { unitTestSigningAccount } from '../Account/index.ts'
import { getNewBoundWitnesses } from '../BoundWitness/index.ts'

type BoundWitnessBuilderBuildResult = Awaited<ReturnType<BoundWitnessBuilder['build']>>

export const getNewBlock = async (...payloads: Payload[]): Promise<BoundWitnessBuilderBuildResult> => {
  const signer = await unitTestSigningAccount()
  return await new BoundWitnessBuilder().signer(signer).payloads(payloads).build()
}

export const getNewBlocks = async (numBoundWitnesses = 1): Promise<BoundWitness[]> => {
  const blocksWithPayloads = await getNewBlocksWithPayloads(numBoundWitnesses)
  return blocksWithPayloads.map(([block]) => block)
}

export const getNewBlocksWithPayloads = async (
  numBoundWitnesses = 1,
  numPayloads = 1,
): Promise<BoundWitnessBuilderBuildResult[]> => {
  return await getNewBoundWitnesses([await unitTestSigningAccount()], numBoundWitnesses, numPayloads)
}
