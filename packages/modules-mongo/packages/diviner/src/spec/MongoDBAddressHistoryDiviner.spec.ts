import '@xylabs/vitest-extended'

import { delay } from '@xylabs/delay'
import type { Address } from '@xylabs/hex'
import { Account } from '@xyo-network/account'
import type { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { BoundWitnessSchema } from '@xyo-network/boundwitness-model'
import type { AddressHistoryQueryPayload } from '@xyo-network/diviner-address-history'
import { AddressHistoryDivinerConfigSchema, AddressHistoryQuerySchema } from '@xyo-network/diviner-address-history'
import { COLLECTIONS, hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import {
  type BoundWitnessWithMongoMeta, type BoundWitnessWithPartialMongoMeta, toDbRepresentation,
} from '@xyo-network/payload-mongodb'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import {
  beforeAll, describe, expect, it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { MongoDBAddressHistoryDiviner } from '../MongoDBAddressHistoryDiviner.js'

/**
 * @group mongo
 */

describe.runIf(hasMongoDBConfig())('MongoDBAddressHistoryDiviner', () => {
  let account: AccountInstance
  let address: Address
  const logger = mock<Console>()
  const boundWitnessSdk = new BaseMongoSdk<BoundWitnessWithMongoMeta>({
    collection: COLLECTIONS.BoundWitnesses,
    dbConnectionString: process.env.MONGO_CONNECTION_STRING,
  })
  let sut: MongoDBAddressHistoryDiviner
  beforeAll(async () => {
    account = await Account.random()
    address = account.address
    sut = await MongoDBAddressHistoryDiviner.create({
      account: 'random',
      config: { schema: AddressHistoryDivinerConfigSchema },
      logger,
    })
    // TODO: Insert via archivist
    const payload = { schema: 'network.xyo.test' }
    const [bw] = await new BoundWitnessBuilder().payload(payload).signer(account).build()
    const mongoBw = await toDbRepresentation(bw)
    await boundWitnessSdk.insertOne(mongoBw)
    await delay(1)
    const [bw2] = await new BoundWitnessBuilder().payload(payload).signer(account).build()
    const mongoBw2 = await toDbRepresentation(bw2)
    await boundWitnessSdk.insertOne(mongoBw2)
    await delay(1000)
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const query: AddressHistoryQueryPayload = {
          address, limit: 2, schema: AddressHistoryQuerySchema,
        }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(2)
        const actual = result[0] as BoundWitnessWithPartialMongoMeta
        expect(actual).toBeObject()
        expect(actual.schema).toBe(BoundWitnessSchema)
      })
    })
  })
})
