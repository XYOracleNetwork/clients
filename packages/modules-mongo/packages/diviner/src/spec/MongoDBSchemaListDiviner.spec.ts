import '@xylabs/vitest-extended'

import type { Address } from '@xylabs/hex'
import { Account } from '@xyo-network/account'
import type { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type {
  SchemaListPayload,
  SchemaListQueryPayload,
} from '@xyo-network/diviner-schema-list-model'
import {
  SchemaListDivinerConfigSchema,
  SchemaListDivinerSchema,
  SchemaListQuerySchema,
} from '@xyo-network/diviner-schema-list-model'
import { COLLECTIONS, hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type {
  Payload, WithSources, WithStorageMeta,
} from '@xyo-network/payload-model'
import { type BoundWitnessWithMongoMeta, toDbRepresentation } from '@xyo-network/payload-mongodb'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import {
  beforeAll, describe, expect, it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { MongoDBSchemaListDiviner } from '../MongoDBSchemaListDiviner.js'

/**
 * @group mongo
 */

describe.runIf(hasMongoDBConfig())('MongoDBSchemaListDiviner', () => {
  let account: AccountInstance
  let address: Address
  const phrase = 'guide drop pole matter mandate sand social chest toe scene primary alien'
  const logger = mock<Console>()
  const boundWitnessSdk: BaseMongoSdk<BoundWitnessWithMongoMeta> = new BaseMongoSdk<BoundWitnessWithMongoMeta>({
    collection: COLLECTIONS.BoundWitnesses,
    dbConnectionString: process.env.MONGO_CONNECTION_STRING,
  })
  let sut: MongoDBSchemaListDiviner
  beforeAll(async () => {
    account = await Account.create({ phrase })
    address = account.address
    sut = await MongoDBSchemaListDiviner.create({
      account: 'random',
      config: { schema: SchemaListDivinerConfigSchema },
      logger,
    })
    // TODO: Insert via archivist
    const payload: Payload = new PayloadBuilder({ schema: 'network.xyo.test' }).build()
    const [bw] = (await (new BoundWitnessBuilder().payload(payload)).signer(account).build())
    await boundWitnessSdk.insertOne(toDbRepresentation(await BoundWitnessBuilder.addStorageMeta(bw)))
  })
  describe('divine', () => {
    describe('with address supplied in query', () => {
      it('divines results for the address', async () => {
        const query: SchemaListQueryPayload = { address, schema: SchemaListQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0] as WithSources<WithStorageMeta<SchemaListPayload>>
        expect(actual).toBeObject()
        expect(actual.schema).toBe(SchemaListDivinerSchema)
        expect(actual.schemas).toBeArray()
        actual.schemas.map((schema) => {
          expect(schema).toBeString()
        })
      })
    })
    describe('with no address supplied in query', () => {
      it('divines results for all addresses', async () => {
        const query: SchemaListQueryPayload = { schema: SchemaListQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0] as WithSources<WithStorageMeta<SchemaListPayload>>
        expect(actual).toBeObject()
        expect(actual.schema).toBe(SchemaListDivinerSchema)
        expect(actual.schemas).toBeArray()
        actual.schemas.map((schema) => {
          expect(schema).toBeString()
        })
      })
    })
  })
})
