import { delay } from '@xylabs/delay'
import { describeIf } from '@xylabs/jest-helpers'
import { Account } from '@xyo-network/account'
import { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { BoundWitnessSchema } from '@xyo-network/boundwitness-model'
import { AddressHistoryDivinerConfigSchema, AddressHistoryQueryPayload, AddressHistoryQuerySchema } from '@xyo-network/diviner-address-history'
import { COLLECTIONS, hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { BoundWitnessWithMongoMeta, BoundWitnessWithPartialMongoMeta } from '@xyo-network/payload-mongodb'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { mock } from 'jest-mock-extended'

import { MongoDBAddressHistoryDiviner } from '../MongoDBAddressHistoryDiviner'

/**
 * @group mongo
 */

describeIf(hasMongoDBConfig())('MongoDBAddressHistoryDiviner', () => {
  const phrase = 'forum travel tattoo shock team artist stone fine will fan answer tribe'
  let account: AccountInstance
  let address: string
  const logger = mock<Console>()
  const boundWitnessSdk = new BaseMongoSdk<BoundWitnessWithMongoMeta>({
    collection: COLLECTIONS.BoundWitnesses,
    dbConnectionString: process.env.MONGO_CONNECTION_STRING,
  })
  let sut: MongoDBAddressHistoryDiviner
  beforeAll(async () => {
    account = await Account.create({ phrase })
    address = account.address
    sut = await MongoDBAddressHistoryDiviner.create({
      account: Account.randomSync(),
      config: { schema: AddressHistoryDivinerConfigSchema },
      logger,
    })
    // TODO: Insert via archivist
    const payload = await new PayloadBuilder({ schema: 'network.xyo.test' }).build()
    const [bw] = await (await new BoundWitnessBuilder().payload(payload)).witness(account).build()
    await boundWitnessSdk.insertOne(bw as unknown as BoundWitnessWithMongoMeta)
    const [bw2] = await (await new BoundWitnessBuilder().payload(payload)).witness(account).build()
    await boundWitnessSdk.insertOne(bw2 as unknown as BoundWitnessWithMongoMeta)
    await delay(1000)
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const query: AddressHistoryQueryPayload = { address, limit: 1, schema: AddressHistoryQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(2)
        const actual = result[0] as BoundWitnessWithPartialMongoMeta
        expect(actual).toBeObject()
        expect(actual.schema).toBe(BoundWitnessSchema)
      })
    })
  })
})
