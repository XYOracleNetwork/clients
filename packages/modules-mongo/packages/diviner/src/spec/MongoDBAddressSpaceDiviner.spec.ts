import { describeIf } from '@xylabs/jest-helpers'
import { Account } from '@xyo-network/account'
import { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { AddressSpaceDivinerConfigSchema } from '@xyo-network/diviner-address-space-model'
import { COLLECTIONS, hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import { AddressPayload, AddressSchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { isPayloadOfSchemaTypeWithMeta } from '@xyo-network/payload-model'
import { BoundWitnessWithMongoMeta } from '@xyo-network/payload-mongodb'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { mock } from 'jest-mock-extended'

import { MongoDBAddressSpaceDiviner } from '../MongoDBAddressSpaceDiviner'

/**
 * @group mongo
 */

describeIf(hasMongoDBConfig())('MongoDBAddressSpaceDiviner', () => {
  const phrase = 'reflect dash pear scatter kiwi sock ability muffin clever effort enroll school'
  let account: AccountInstance
  const logger = mock<Console>()
  const boundWitnessSdk = new BaseMongoSdk<BoundWitnessWithMongoMeta>({
    collection: COLLECTIONS.BoundWitnesses,
    dbConnectionString: process.env.MONGO_CONNECTION_STRING,
  })
  let sut: MongoDBAddressSpaceDiviner
  beforeAll(async () => {
    account = await Account.create({ phrase })
    sut = await MongoDBAddressSpaceDiviner.create({
      account,
      config: { schema: AddressSpaceDivinerConfigSchema },
      logger,
    })
    // TODO: Insert via archivist
    const payload = await new PayloadBuilder({ schema: 'network.xyo.test' }).build()
    const bw = (await (await new BoundWitnessBuilder().payload(payload)).witness(account).build())[0]
    await boundWitnessSdk.insertOne(bw as unknown as BoundWitnessWithMongoMeta)
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const result = (await sut.divine([])).filter(isPayloadOfSchemaTypeWithMeta<AddressPayload>(AddressSchema))
        expect(result).toBeArray()
        expect(result.length).toBeGreaterThan(0)
        await Promise.all(
          result.map((address) => {
            const payload = PayloadWrapper.wrap<AddressPayload>(address)
            expect(payload.schema()).toBe(AddressSchema)
            expect(payload.payload.address).toBeString()
          }),
        )
      })
    })
  })
})
