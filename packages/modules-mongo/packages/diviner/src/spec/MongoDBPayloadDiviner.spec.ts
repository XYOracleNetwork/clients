import '@xylabs/vitest-extended'

import { BaseMongoSdk } from '@xylabs/mongo'
import type { PayloadDivinerQueryPayload } from '@xyo-network/diviner-payload-model'
import { PayloadDivinerConfigSchema, PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import { COLLECTIONS, hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { type PayloadWithMongoMeta, toDbRepresentation } from '@xyo-network/payload-mongodb'
import {
  beforeAll, describe, expect, it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { MongoDBPayloadDiviner } from '../MongoDBPayloadDiviner.js'

/**
 * @group mongo
 */

describe.runIf(hasMongoDBConfig())('MongoDBPayloadDiviner', () => {
  const testSchema = 'network.xyo.test'
  const logger = mock<Console>()
  const payloadSdk: BaseMongoSdk<PayloadWithMongoMeta> = new BaseMongoSdk<PayloadWithMongoMeta>({
    collection: COLLECTIONS.Payloads,
    dbConnectionString: process.env.MONGO_CONNECTION_STRING,
  })
  const url = 'https://xyo.network'
  let sut: MongoDBPayloadDiviner
  beforeAll(async () => {
    sut = await MongoDBPayloadDiviner.create({
      account: 'random',
      config: { schema: PayloadDivinerConfigSchema },
      logger,
    })

    const payload = toDbRepresentation(
      await PayloadBuilder.addStorageMeta(
        new PayloadBuilder<{ schema: string; url: string }>({ schema: testSchema })
          .fields({ url })
          .build(),
      ),
    )
    await payloadSdk.insertOne(payload)
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const query: PayloadDivinerQueryPayload = {
          limit: 1, schema: PayloadDivinerQuerySchema, schemas: [testSchema],
        }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0]
        expect(actual).toBeObject()
        expect(actual.schema).toBeDefined()
        expect(actual.schema).toBeString()
      })
    })
    describe('with custom query prop', () => {
      it('returns payloads matching the filter criteria', async () => {
        const query: PayloadDivinerQueryPayload & { url: string } = {
          limit: 1, schema: PayloadDivinerQuerySchema, url,
        }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0]
        expect(actual).toBeObject()
        expect(actual.schema).toBeDefined()
        expect(actual.schema).toBeString()
        expect((actual as { url?: string })?.url).toBe(url)
      })
      it('does not return payloads not matching the filter criteria', async () => {
        const query: PayloadDivinerQueryPayload & { url: string } = {
          limit: 1, schema: PayloadDivinerQuerySchema, url: 'https://foo.bar',
        }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(0)
      })
    })
  })
})
