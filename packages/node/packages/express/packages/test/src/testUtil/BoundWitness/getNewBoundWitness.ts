import type { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { Payload } from '@xyo-network/payload-model'

import { unitTestSigningAccount } from '../Account/index.js'
import { getNewPayloads } from '../Payload/index.js'

type BoundWitnessBuilderBuildResult = Awaited<ReturnType<BoundWitnessBuilder['build']>>

export const getNewBoundWitness = async (signers?: AccountInstance[], payloads?: Payload[]): Promise<BoundWitnessBuilderBuildResult> => {
  const p = payloads ?? getNewPayloads(1)
  const accounts: AccountInstance[] = signers ?? [await unitTestSigningAccount()]
  return await (new BoundWitnessBuilder().payloads(p)).signers(accounts).build()
}

export const getNewBoundWitnesses = async (
  signers?: AccountInstance[],
  numBoundWitnesses = 1,
  numPayloads = 1,
): Promise<BoundWitnessBuilderBuildResult[]> => {
  const accounts = signers ?? [await unitTestSigningAccount()]
  const response: BoundWitnessBuilderBuildResult[] = []
  for (let i = 0; i < numBoundWitnesses; i++) {
    const payloads = await getNewPayloads(numPayloads)
    const bw = await getNewBoundWitness(accounts, payloads)
    response.push(bw)
  }
  return response
}
