import '@xylabs/vitest-extended'

import type { Address } from '@xylabs/hex'
import { BaseMongoSdk } from '@xylabs/mongo'
import { Account } from '@xyo-network/account'
import type {
  SchemaStatsPayload,
  SchemaStatsQueryPayload,
} from '@xyo-network/diviner-schema-stats-model'
import {
  SchemaStatsDivinerConfigSchema,
  SchemaStatsDivinerSchema,
  SchemaStatsQuerySchema,
} from '@xyo-network/diviner-schema-stats-model'
import { COLLECTIONS, hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import type { JobQueue } from '@xyo-network/node-core-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { type PayloadWithMongoMeta, toDbRepresentation } from '@xyo-network/payload-mongodb'
import {
  beforeAll, describe, expect, it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { MongoDBSchemaStatsDiviner } from '../MongoDBSchemaStatsDiviner.js'

/**
 * @group mongo
 */

describe.runIf(hasMongoDBConfig())('MongoDBSchemaStatsDiviner', () => {
  const phrase = 'forum travel tattoo shock team artist stone fine will fan answer tribe'
  let address: Address
  const logger = mock<Console>()

  const payloadSdk: BaseMongoSdk<PayloadWithMongoMeta> = new BaseMongoSdk<PayloadWithMongoMeta>({
    collection: COLLECTIONS.Payloads,
    dbConnectionString: process.env.MONGO_CONNECTION_STRING,
  })
  const jobQueue: JobQueue = mock<JobQueue>()
  let sut: MongoDBSchemaStatsDiviner
  beforeAll(async () => {
    address = (await Account.create({ phrase })).address
    sut = await MongoDBSchemaStatsDiviner.create({
      account: 'random',
      config: { schema: SchemaStatsDivinerConfigSchema },
      jobQueue,
      logger,
    })
    // TODO: Insert via archivist
    const payload = new PayloadBuilder({ schema: 'network.xyo.test' }).build()
    await payloadSdk.insertOne(toDbRepresentation(await PayloadBuilder.addStorageMeta(payload)))
  })
  describe('divine', () => {
    describe('with address supplied in query', () => {
      it('divines results for the address', async () => {
        const query: SchemaStatsQueryPayload = { address, schema: SchemaStatsQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0] as SchemaStatsPayload
        expect(actual).toBeObject()
        expect(actual.schema).toBe(SchemaStatsDivinerSchema)
        expect(actual.count).toBeObject()
        for (const entry of Object.entries(actual.count)) {
          expect(entry[0]).toBeString()
          expect(entry[1]).toBeNumber()
        }
      })
    })
    describe('with no address supplied in query', () => {
      it('is not implemented', async () => {
        const query: SchemaStatsQueryPayload = { schema: SchemaStatsQuerySchema }
        await expect(sut.divine([query])).rejects.toBeInstanceOf(Error)
      })
    })
  })
})
