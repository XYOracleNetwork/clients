import { ArchivistInstance } from '@xyo-network/archivist-model'
import { DivinerDivineQuerySchema, DivinerInstance } from '@xyo-network/diviner'
import { PayloadDivinerQueryPayload, PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload, WithMeta } from '@xyo-network/payload-model'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

import { getArchivistByName, getDivinerByName, getNewPayload, getTestSchemaName, nonExistentHash, validateStateResponse } from '../../testUtil'

const schema = PayloadDivinerQuerySchema

const moduleName = 'XYOPublic:PayloadDiviner'
describe(`/${moduleName}`, () => {
  let diviner: DivinerInstance
  let archivist: ArchivistInstance

  beforeAll(async () => {
    diviner = await getDivinerByName(moduleName)
    archivist = await getArchivistByName()
  })
  describe('ModuleDiscoverQuerySchema', () => {
    it('discovers', async () => {
      const response = await diviner.state()
      expect(response).toBeArray()
      validateStateResponse(response, [DivinerDivineQuerySchema])
    })
  })
  describe('DivinerDivineQuerySchema', () => {
    describe('hash', () => {
      let payload: PayloadWrapper
      beforeAll(async () => {
        payload = PayloadWrapper.wrap(await getNewPayload())
        await archivist.insert([payload.payload])
        const hash = await payload.dataHash()
        const payloads = await archivist.get([hash])
        expect(payloads).toBeArrayOfSize(1)
      })
      it('divines Payloads by hash', async () => {
        const hash = await payload.dataHash()
        const query: PayloadDivinerQueryPayload = { hash, schema }
        const response = await diviner.divine([query])
        expect(response).toBeArrayOfSize(1)
        const responseHashes = await Promise.all(response.map((p) => PayloadBuilder.dataHash(p)))
        expect(responseHashes).toContainAllValues([await payload.dataHash()])
      })
      it('returns empty array for non-existent hash', async () => {
        const hash = nonExistentHash
        const query: PayloadDivinerQueryPayload = { hash, schema }
        const response = await diviner.divine([query])
        expect(response).toBeArrayOfSize(0)
      })
    })
    describe('limit', () => {
      beforeAll(async () => {
        const schemaA = getTestSchemaName()
        const schemaB = getTestSchemaName()
        const payloadBaseA = { ...(await getNewPayload()), schema: schemaA }
        const payloadA: PayloadWrapper = PayloadWrapper.wrap(payloadBaseA)
        const payloadBaseB = { ...(await getNewPayload()), schema: schemaB }
        const payloadB: PayloadWrapper = PayloadWrapper.wrap(await payloadBaseB)
        await archivist.insert([payloadA.payload, payloadB.payload])
      })
      it.each([1, 2])('returns the specified number of Payloads', async (limit) => {
        const query: PayloadDivinerQueryPayload = { limit, schema }
        const response = await diviner.divine([query])
        expect(response).toBeArrayOfSize(limit)
      })
    })
    describe('offset', () => {
      it.skip('divines Payloads from offset', async () => {
        const query: PayloadDivinerQueryPayload = { schema }
        const response = await diviner.divine([query])
        expect(response).toBeArray()
        expect(response.length).toBeGreaterThan(0)
      })
    })
    describe('order', () => {
      it.skip('divines Payloads in order', async () => {
        const query: PayloadDivinerQueryPayload = { schema }
        const response = await diviner.divine([query])
        expect(response).toBeArray()
        expect(response.length).toBeGreaterThan(0)
      })
    })
    describe('schema', () => {
      let payloadA: PayloadWrapper
      let payloadB: PayloadWrapper
      let inserted: WithMeta<Payload>[]
      beforeAll(async () => {
        const schemaA = getTestSchemaName()
        const schemaB = getTestSchemaName()
        const payloadBaseA = await PayloadBuilder.build({ ...(await getNewPayload()), schema: schemaA })
        payloadA = PayloadWrapper.wrap(payloadBaseA)
        const payloadBaseB = await PayloadBuilder.build({ ...(await getNewPayload()), schema: schemaB })
        payloadB = PayloadWrapper.wrap(payloadBaseB)
        inserted = await archivist.insert([payloadA.payload, payloadB.payload])

        const payload = PayloadWrapper.wrap({ salt: Date.now(), schema: 'network.xyo.test' })

        const dataHash = await payload.dataHash()
        const result = await archivist.insert([payload.payload])

        const resultDataHash = await PayloadBuilder.dataHash(result[0])
        expect(dataHash).toEqual(resultDataHash)
      })
      describe('with single schema', () => {
        it('divines Payloads by schema', async () => {
          const payloads = [payloadA]
          const schemas = payloads.map((p) => p.schema())
          const query: PayloadDivinerQueryPayload = { schema, schemas }
          const response = await diviner.divine([query])
          expect(response).toBeArrayOfSize(payloads.length)
          // const insertedHash = await PayloadBuilder.hash(inserted[0])
          // const insertedDataHash = await PayloadBuilder.dataHash(inserted[0])
          // const originalHash = await payloadA.hash()
          // const originalDataHash = await payloadA.dataHash()
          expect(await PayloadBuilder.dataHashes(inserted)).toInclude(await payloadA.dataHash())
          // const insertedDataHashes = await Promise.all(inserted.map((p) => PayloadBuilder.dataHash(p)))
          // const insertedHashes = await Promise.all(inserted.map((p) => PayloadBuilder.hash(p)))
          // const inputDataHashes = await Promise.all(payloads.map((p) => p.dataHash()))
          // const inputHashes = await Promise.all(payloads.map((p) => p.hash()))
          const payloadHashes = await Promise.all(payloads.map((p) => p.dataHash()))
          const responseHashes = await Promise.all(response.map((p) => PayloadBuilder.dataHash(p)))
          expect(responseHashes).toContainAllValues(payloadHashes)
        })
      })
      describe('with multiple schemas', () => {
        it('divines Payloads by schema', async () => {
          const payloads = [payloadA, payloadB]
          const schemas = payloads.map((p) => p.schema())
          const query: PayloadDivinerQueryPayload = { schema, schemas }
          const response = await diviner.divine([query])
          expect(response).toBeArrayOfSize(payloads.length)
          const responseHashes = await Promise.all(response.map((p) => PayloadBuilder.dataHash(p)))
          const payloadsHashes = await Promise.all(payloads.map((p) => p.dataHash()))
          expect(responseHashes).toContainAllValues(payloadsHashes)
        })
      })
    })
  })
})
