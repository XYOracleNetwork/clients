import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { Payload } from '@xyo-network/payload-model'
import type { BoundWitnessWithPartialMongoMeta, PayloadWithPartialMongoMeta } from '@xyo-network/payload-mongodb'

import { unitTestSigningAccount } from '../Account/index.js'
import { getNewPayloads } from '../Payload/index.js'

export const getNewBlock = async (...payloads: Payload[]): Promise<BoundWitnessWithPartialMongoMeta & PayloadWithPartialMongoMeta> => {
  return (await (await new BoundWitnessBuilder().witness(await unitTestSigningAccount()).payloads(payloads)).build())[0]
}

export const getNewBlockWithPayloads = async (numPayloads = 1) => {
  return getNewBlock(...(await getNewPayloads(numPayloads)))
}

export const getNewBlocks = async (numBoundWitnesses = 1): Promise<Array<BoundWitnessWithPartialMongoMeta & PayloadWithPartialMongoMeta>> => {
  const sequence = Array.from({ length: numBoundWitnesses }).fill(0)
  const values = await Promise.all(
    sequence.map(async () => {
      return (await new BoundWitnessBuilder().witness(await unitTestSigningAccount()).build())[0]
    }),
  )
  return values
}

export const getNewBlocksWithPayloads = async (
  numBoundWitnesses = 1,
  numPayloads = 1,
): Promise<Array<BoundWitnessWithPartialMongoMeta & PayloadWithPartialMongoMeta>> => {
  return await Promise.all(
    Array.from({ length: numBoundWitnesses })
      .fill(0)
      .map(async () => {
        return (
          await (await new BoundWitnessBuilder().witness(await unitTestSigningAccount()).payloads(await getNewPayloads(numPayloads))).build()
        )[0]
      }),
  )
}
