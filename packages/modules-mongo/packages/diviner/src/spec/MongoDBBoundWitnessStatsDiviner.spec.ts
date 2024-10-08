import type { Address } from '@xylabs/hex'
import { describeIf } from '@xylabs/jest-helpers'
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
import type { JobQueue } from '@xyo-network/node-core-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { WithMeta } from '@xyo-network/payload-model'
import type { BoundWitnessWithMongoMeta } from '@xyo-network/payload-mongodb'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import type { MockProxy } from 'jest-mock-extended'
import { mock } from 'jest-mock-extended'

import { MongoDBBoundWitnessStatsDiviner } from '../MongoDBBoundWitnessStatsDiviner.js'

/**
 * @group mongo
 */

describeIf(hasMongoDBConfig())('MongoDBBoundWitnessStatsDiviner', () => {
  const phrase = 'forum travel tattoo shock team artist stone fine will fan answer tribe'
  let account: AccountInstance
  let address: Address
  const logger = mock<Console>()
  const boundWitnessSdk = new BaseMongoSdk<BoundWitnessWithMongoMeta>({
    collection: COLLECTIONS.BoundWitnesses,
    dbConnectionString: process.env.MONGO_CONNECTION_STRING,
  })
  const jobQueue: MockProxy<JobQueue> = mock<JobQueue>()
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
    const payload = await new PayloadBuilder({ schema: 'network.xyo.test' }).build()
    const bw = (await (await new BoundWitnessBuilder().payload(payload)).witness(account).build())[0]
    await boundWitnessSdk.insertOne(bw as unknown as BoundWitnessWithMongoMeta)
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
        expect((actual as WithMeta<BoundWitnessStatsPayload>).count).toBeNumber()
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
        expect((actual as WithMeta<BoundWitnessStatsPayload>).count).toBeNumber()
      })
    })
  })
})
