import { describeIf } from '@xylabs/jest-helpers'
import { Account } from '@xyo-network/account'
import { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { BoundWitnessSchema } from '@xyo-network/boundwitness-model'
import {
  BoundWitnessDivinerConfigSchema,
  BoundWitnessDivinerQueryPayload,
  BoundWitnessDivinerQuerySchema,
} from '@xyo-network/diviner-boundwitness-model'
import { COLLECTIONS, hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { BoundWitnessWithMongoMeta, BoundWitnessWithPartialMongoMeta } from '@xyo-network/payload-mongodb'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { mock } from 'jest-mock-extended'

import { MongoDBBoundWitnessDiviner } from '../MongoDBBoundWitnessDiviner'

/**
 * @group mongo
 */

describeIf(hasMongoDBConfig())('MongoDBBoundWitnessDiviner', () => {
  const phrase = 'reflect dash pear scatter kiwi sock ability muffin clever effort enroll school'
  let account: AccountInstance
  const logger = mock<Console>()
  const boundWitnessSdkConfig = {
    collection: COLLECTIONS.BoundWitnesses,
    dbConnectionString: process.env.MONGO_CONNECTION_STRING,
  }
  const boundWitnessSdk = new BaseMongoSdk<BoundWitnessWithMongoMeta>(boundWitnessSdkConfig)
  let sut: MongoDBBoundWitnessDiviner
  let accountA: AccountInstance
  let accountB: AccountInstance
  const accounts: AccountInstance[] = []
  beforeAll(async () => {
    accountA = await Account.create()
    accounts.push(accountA)
    accountB = await Account.create()
    accounts.push(accountB)
    account = await Account.create({ phrase })
    sut = await MongoDBBoundWitnessDiviner.create({
      account,
      boundWitnessSdkConfig,
      config: { schema: BoundWitnessDivinerConfigSchema },
      logger,
    })
    // TODO: Insert via archivist
    const payloadA = await new PayloadBuilder({ schema: 'network.xyo.test' }).fields({ nonce: 1 }).build()
    const bwA = (await (await new BoundWitnessBuilder().payload(payloadA)).witness(accountA).build())[0]
    await boundWitnessSdk.insertOne(bwA as unknown as BoundWitnessWithMongoMeta)
    const payloadB = await new PayloadBuilder({ schema: 'network.xyo.test' }).fields({ nonce: 2 }).build()
    const bwB = (await (await new BoundWitnessBuilder().payload(payloadB)).witness(accountB).build())[0]
    await boundWitnessSdk.insertOne(bwB as unknown as BoundWitnessWithMongoMeta)
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const query: BoundWitnessDivinerQueryPayload = { limit: 1, schema: BoundWitnessDivinerQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0] as BoundWitnessWithPartialMongoMeta
        expect(actual).toBeObject()
        expect(actual.schema).toBe(BoundWitnessSchema)
      })
    })
    describe('with filter for address', () => {
      it.each([0, 1])('divines BWs for address', async (index) => {
        const account = accounts[index]
        const addresses = [account.address]
        const query: BoundWitnessDivinerQueryPayload = { addresses, limit: 1, schema: BoundWitnessDivinerQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0] as BoundWitnessWithPartialMongoMeta
        expect(actual).toBeObject()
        expect(actual.schema).toBe(BoundWitnessSchema)
        expect(actual.addresses).toContain(account.address)
      })
    })
  })
})
