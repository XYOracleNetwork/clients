import '@xylabs/vitest-extended'

import { Account } from '@xyo-network/account'
import type {
  PayloadStatsPayload,
  PayloadStatsQueryPayload,
} from '@xyo-network/diviner-payload-stats-model'
import {
  PayloadStatsDivinerConfigSchema,
  PayloadStatsDivinerSchema,
  PayloadStatsQuerySchema,
} from '@xyo-network/diviner-payload-stats-model'
import { hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import type { JobQueue } from '@xyo-network/shared'
import {
  beforeAll, describe, expect,
  it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { MongoDBPayloadStatsDiviner } from '../MongoDBPayloadStatsDiviner.js'

/**
 * @group mongo
 */

describe.runIf(hasMongoDBConfig())('MongoDBPayloadStatsDiviner', () => {
  const phrase = 'guide drop pole matter mandate sand social chest toe scene primary alien'
  let address: string
  const logger = mock<Console>()

  const jobQueue: JobQueue = mock<JobQueue>()
  let sut: MongoDBPayloadStatsDiviner
  beforeAll(async () => {
    address = (await Account.create({ phrase })).address
    sut = await MongoDBPayloadStatsDiviner.create({
      account: 'random',
      config: { schema: PayloadStatsDivinerConfigSchema },
      jobQueue,
      logger,
    })
  })
  describe('divine', () => {
    describe('with address supplied in query', () => {
      it('divines results for the address', async () => {
        const query = { address, schema: PayloadStatsQuerySchema } as PayloadStatsQueryPayload
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0] as PayloadStatsPayload
        expect(actual).toBeObject()
        expect(actual.schema).toBe(PayloadStatsDivinerSchema)
        expect(actual.count).toBeNumber()
      })
    })
    describe('with no address supplied in query', () => {
      it('divines results for all addresses', async () => {
        const query: PayloadStatsQueryPayload = { schema: PayloadStatsQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0] as PayloadStatsPayload
        expect(actual).toBeObject()
        expect(actual.schema).toBe(PayloadStatsDivinerSchema)
        expect(actual.count).toBeNumber()
      })
    })
  })
})
