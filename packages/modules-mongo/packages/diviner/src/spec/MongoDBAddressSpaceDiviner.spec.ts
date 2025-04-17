import '@xylabs/vitest-extended'

import { BaseMongoSdk } from '@xylabs/mongo'
import { Account } from '@xyo-network/account'
import type { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { UnsignedBoundWitness } from '@xyo-network/boundwitness-model'
import { AddressSpaceDivinerConfigSchema } from '@xyo-network/diviner-address-space-model'
import { COLLECTIONS, hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import type { AddressPayload } from '@xyo-network/module-model'
import { AddressSchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { AnyPayload, Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { type BoundWitnessWithMongoMeta, toDbRepresentation } from '@xyo-network/payload-mongodb'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import {
  beforeAll, describe, expect, it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { MongoDBAddressSpaceDiviner } from '../MongoDBAddressSpaceDiviner.js'

// describeIf(hasMongoDBConfig())('MongoDBAddressSpaceDiviner', () => {
describe.runIf(hasMongoDBConfig())('MongoDBAddressSpaceDiviner', () => {
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
    const payload: Payload = new PayloadBuilder({ schema: 'network.xyo.test' }).build()
    const [bw] = (await (new BoundWitnessBuilder<UnsignedBoundWitness, AnyPayload>().payload(payload)).signer(account).build())
    await boundWitnessSdk.insertOne(toDbRepresentation(await BoundWitnessBuilder.addStorageMeta(bw)))
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const result = (await sut.divine([])).filter(isPayloadOfSchemaType<AddressPayload>(AddressSchema))
        expect(result).toBeArray()
        expect(result.length).toBeGreaterThan(0)
        for (const address of result) {
          const payload = PayloadWrapper.wrap<AddressPayload>(address)
          expect(payload.schema()).toBe(AddressSchema)
          expect(payload.payload.address).toBeString()
        }
      })
    })
  })
})
