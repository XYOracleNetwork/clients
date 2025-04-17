import '@xylabs/vitest-extended'

import { BaseMongoSdk } from '@xylabs/mongo'
import { Account } from '@xyo-network/account'
import type { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { BoundWitnessSchema } from '@xyo-network/boundwitness-model'
import type { BoundWitnessDivinerQueryPayload } from '@xyo-network/diviner-boundwitness-model'
import {
  BoundWitnessDivinerConfigSchema,
  BoundWitnessDivinerQuerySchema,
} from '@xyo-network/diviner-boundwitness-model'
import { COLLECTIONS, hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import {
  type BoundWitnessWithMongoMeta, type BoundWitnessWithPartialMongoMeta, toDbRepresentation,
} from '@xyo-network/payload-mongodb'
import {
  beforeAll, describe, expect, it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { MongoDBBoundWitnessDiviner } from '../MongoDBBoundWitnessDiviner.js'

/**
 * @group mongo
 */

describe.runIf(hasMongoDBConfig())('MongoDBBoundWitnessDiviner', () => {
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
    const payloadA: Payload = new PayloadBuilder({ schema: 'network.xyo.test' }).fields({ nonce: 1 }).build()

    const [bwAWithoutMeta] = await new BoundWitnessBuilder().payload(payloadA).signer(accountA).build()
    const bwA = await PayloadBuilder.addStorageMeta(bwAWithoutMeta)
    await boundWitnessSdk.insertOne(toDbRepresentation(bwA))

    const payloadB: Payload = new PayloadBuilder({ schema: 'network.xyo.test' }).fields({ nonce: 2 }).build()

    const [bwBWithoutMeta] = await new BoundWitnessBuilder().payload(payloadB).signer(accountB).build()
    const bwB = await PayloadBuilder.addStorageMeta(bwBWithoutMeta)
    await boundWitnessSdk.insertOne(toDbRepresentation(bwB))
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
        const query: BoundWitnessDivinerQueryPayload = {
          addresses, limit: 1, schema: BoundWitnessDivinerQuerySchema,
        }
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
