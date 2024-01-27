import { Account } from '@xyo-network/account'
import { ArchivistInsertQuery, ArchivistInsertQuerySchema } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder, BoundWitnessBuilderConfig, QueryBoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { BoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload } from '@xyo-network/payload-model'
import { PayloadWithMongoMeta } from '@xyo-network/payload-mongodb'

import { validByType } from '../validByType'

const config: BoundWitnessBuilderConfig = { inlinePayloads: true }

type DebugPayloadWithMeta = PayloadWithMongoMeta & { nonce: string }

describe('validByType', () => {
  const account = Account.randomSync()
  const payload1 = new PayloadBuilder<DebugPayloadWithMeta>({ schema: 'network.xyo.debug' }).fields({ nonce: '1' }).build()
  const payload2 = new PayloadBuilder<DebugPayloadWithMeta>({ schema: 'network.xyo.debug' }).fields({ nonce: '2' }).build()
  describe('QueryBoundWitness with Payloads & nested BoundWitnesses', () => {
    let result: [BoundWitness[], Payload[]]
    beforeAll(async () => {
      const inner = await (await new BoundWitnessBuilder(config).witness(account).payload(await payload2)).build()
      const outer = await (await new BoundWitnessBuilder(config).witness(account).payloads([await payload1, inner[0]])).build()
      const queryPayload: ArchivistInsertQuery = { schema: ArchivistInsertQuerySchema }
      const query = await (await new QueryBoundWitnessBuilder(config).witness(account).query(queryPayload)).build()
      const values = [query[0], outer[0], inner[0], await payload1, await payload2] as Payload[]
      result = await validByType(values)
    })
    it('extracts the BoundWitnesses', () => {
      expect(result).toBeArray()
      expect(result?.[0]).toBeArrayOfSize(3)
    })
    it('extracts the Payloads', () => {
      expect(result?.[1]).toBeArrayOfSize(2)
    })
  })
  describe('BoundWitness with Payloads & nested BoundWitnesses', () => {
    let result: [BoundWitness[], Payload[]]
    beforeAll(async () => {
      const inner = await (await new BoundWitnessBuilder(config).witness(account).payload(await payload2)).build()
      const outer = await (await new BoundWitnessBuilder(config).witness(account).payloads([await payload1, inner[0]])).build()
      const values: Payload[] = [outer[0], inner[0], await payload1, await payload2]
      result = await validByType(values)
    })
    it('extracts the BoundWitnesses', () => {
      expect(result).toBeArray()
      expect(result?.[0]).toBeArrayOfSize(2)
    })
    it('extracts the Payloads', () => {
      expect(result?.[1]).toBeArrayOfSize(2)
    })
  })
  describe('BoundWitness with Payloads', () => {
    let result: [BoundWitness[], Payload[]]
    beforeAll(async () => {
      const outer = await (await new BoundWitnessBuilder(config).witness(account).payloads([await payload1, await payload2])).build()
      const values = [outer[0], await payload1, await payload2] as Payload[]
      result = await validByType(values)
    })
    it('extracts the BoundWitnesses', () => {
      expect(result).toBeArray()
      expect(result?.[0]).toBeArrayOfSize(1)
    })
    it('extracts the Payloads', () => {
      expect(result?.[1]).toBeArrayOfSize(2)
    })
  })
  describe('BoundWitness without Payloads', () => {
    let result: [BoundWitness[], Payload[]]
    beforeAll(async () => {
      const outer = await new BoundWitnessBuilder(config).witness(account).build()
      const values = [outer[0]] as Payload[]
      result = await validByType(values)
    })
    it('extracts the BoundWitnesses', () => {
      expect(result).toBeArray()
      expect(result?.[0]).toBeArrayOfSize(1)
    })
    it('extracts the Payloads', () => {
      expect(result?.[1]).toBeArrayOfSize(0)
    })
  })
})
