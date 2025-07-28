import '@xylabs/vitest-extended'

import type { Address } from '@xylabs/hex'
import { BaseMongoSdk } from '@xylabs/mongo'
import { Account } from '@xyo-network/account'
import type { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type {
  BoundWitnessStatsPayload,
  BoundWitnessStatsQueryPayload,
} from '@xyo-network/diviner-boundwitness-stats-model'
import {
  BoundWitnessStatsDivinerConfigSchema,
  BoundWitnessStatsDivinerSchema,
  BoundWitnessStatsQuerySchema,
} from '@xyo-network/diviner-boundwitness-stats-model'
import type { DivinerInstance, DivinerParams } from '@xyo-network/diviner-model'
import { COLLECTIONS, hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import { type BoundWitnessWithMongoMeta, toDbRepresentation } from '@xyo-network/payload-mongodb'
import type { JobQueue } from '@xyo-network/shared'
import {
  beforeAll, describe, expect, it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { MongoDBBoundWitnessStatsDiviner } from '../MongoDBBoundWitnessStatsDiviner.js'

/**
 * @group mongo
 */

describe.runIf(hasMongoDBConfig())('MongoDBBoundWitnessStatsDiviner', () => {
  const phrase = 'forum travel tattoo shock team artist stone fine will fan answer tribe'
  let account: AccountInstance
  let address: Address
  const logger = mock<Console>()
  const boundWitnessSdk = new BaseMongoSdk<BoundWitnessWithMongoMeta>({
    collection: COLLECTIONS.BoundWitnesses,
    dbConnectionString: process.env.MONGO_CONNECTION_STRING,
  })
  const jobQueue: JobQueue = mock<JobQueue>()
  let sut: DivinerInstance<DivinerParams, BoundWitnessStatsQueryPayload, BoundWitnessStatsPayload>
  beforeAll(async () => {
    account = await Account.create({ phrase })
    address = account.address
    sut = await MongoDBBoundWitnessStatsDiviner.create({
      account: 'random',
      config: { schema: BoundWitnessStatsDivinerConfigSchema },
      jobQueue,
      logger,
    })
    // TODO: Insert via archivist
    const payload: Payload = new PayloadBuilder({ schema: 'network.xyo.test' }).build()
    const bw = (await (new BoundWitnessBuilder().payload(payload)).signer(account).build())[0]
    await boundWitnessSdk.insertOne(toDbRepresentation(await BoundWitnessBuilder.addStorageMeta(bw)))
  })
  describe('divine', () => {
    describe('with address supplied in query', () => {
      it('divines results for the address', async () => {
        const query: BoundWitnessStatsQueryPayload = { address, schema: BoundWitnessStatsQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0]
        expect(actual).toBeObject()
        expect(actual.schema).toBe(BoundWitnessStatsDivinerSchema)
        expect((actual as BoundWitnessStatsPayload).count).toBeNumber()
      })
    })
    describe('with no address supplied in query', () => {
      it('divines results for all addresses', async () => {
        const query: BoundWitnessStatsQueryPayload = { schema: BoundWitnessStatsQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0]
        expect(actual).toBeObject()
        expect(actual.schema).toBe(BoundWitnessStatsDivinerSchema)
        expect((actual as BoundWitnessStatsPayload).count).toBeNumber()
      })
    })
  })
})
