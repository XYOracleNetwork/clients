import { Account } from '@xyo-network/account'
import { ArchivistInsertQuery, ArchivistInsertQuerySchema } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder, QueryBoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { BoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload } from '@xyo-network/payload-model'
import { PayloadWithMongoMeta } from '@xyo-network/payload-mongodb'

import { validByType } from '../validByType.js'

type DebugPayloadWithMeta = Partial<PayloadWithMongoMeta<{ nonce: string; schema: string }>> & { schema: string }

describe('validByType', () => {
  const account = Account.random()
  describe('QueryBoundWitness with Payloads & nested BoundWitnesses', () => {
    let result: [BoundWitness[], Payload[]]
    beforeAll(async () => {
      const payload1 = await new PayloadBuilder<DebugPayloadWithMeta>({ schema: 'network.xyo.debug' }).fields({ nonce: '1' }).build()
      const payload2 = await new PayloadBuilder<DebugPayloadWithMeta>({ schema: 'network.xyo.debug' }).fields({ nonce: '2' }).build()
      const inner = await (await new BoundWitnessBuilder().witness(await account).payload(payload2)).build()
      const outer = await (await new BoundWitnessBuilder().witness(await account).payloads([payload1, inner[0]])).build()
      const queryPayload: ArchivistInsertQuery = { schema: ArchivistInsertQuerySchema }
      const query = await (await new QueryBoundWitnessBuilder().witness(await account).query(queryPayload)).build()
      const values = [query[0], outer[0], inner[0], payload1, payload2] as Payload[]
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
      const payload1 = await new PayloadBuilder<DebugPayloadWithMeta>({ schema: 'network.xyo.debug' }).fields({ nonce: '1' }).build()
      const payload2 = await new PayloadBuilder<DebugPayloadWithMeta>({ schema: 'network.xyo.debug' }).fields({ nonce: '2' }).build()
      const inner = await (await new BoundWitnessBuilder().witness(await account).payload(payload2)).build()
      const outer = await (await new BoundWitnessBuilder().witness(await account).payloads([payload1, inner[0]])).build()
      const values: Payload[] = [outer[0], inner[0], payload1, payload2]
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
      const payload1 = await new PayloadBuilder<DebugPayloadWithMeta>({ schema: 'network.xyo.debug' }).fields({ nonce: '1' }).build()
      const payload2 = await new PayloadBuilder<DebugPayloadWithMeta>({ schema: 'network.xyo.debug' }).fields({ nonce: '2' }).build()
      const outer = await (await new BoundWitnessBuilder().witness(await account).payloads([payload1, payload2])).build()
      const values = [outer[0], payload1, payload2] as Payload[]
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
      const outer = await new BoundWitnessBuilder().witness(await account).build()
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
