import { Account } from '@xyo-network/account'
import { ArchivistInstance } from '@xyo-network/archivist-model'
import { BoundWitnessWrapper } from '@xyo-network/boundwitness-wrapper'
import { DivinerDivineQuerySchema, DivinerInstance } from '@xyo-network/diviner'
import { PayloadDivinerQueryPayload, PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

import {
  getArchivist,
  getDivinerByName,
  getNewBoundWitness,
  getNewPayload,
  getTestSchemaName,
  nonExistentHash,
  validateDiscoverResponse,
} from '../../testUtil'

const schema = PayloadDivinerQuerySchema

const moduleName = 'PayloadDiviner'
describe(`/${moduleName}`, () => {
  let diviner: DivinerInstance
  let archivist: ArchivistInstance

  beforeAll(async () => {
    diviner = await getDivinerByName(moduleName)
    archivist = await getArchivist()
  })
  describe('ModuleDiscoverQuerySchema', () => {
    it('discovers', async () => {
      const response = await diviner.discover()
      expect(response).toBeArray()
      validateDiscoverResponse(response, [DivinerDivineQuerySchema])
    })
  })
  describe('DivinerDivineQuerySchema', () => {
    const accountA = Account.randomSync()
    const accountB = Account.randomSync()
    describe.skip('address', () => {
      it('divines Payloads by address', async () => {
        const wrapper: PayloadWrapper = PayloadWrapper.wrap(await getNewPayload())
        const boundWitness: BoundWitnessWrapper = BoundWitnessWrapper.parse((await getNewBoundWitness([accountA], [wrapper.payload()]))[0])
        await archivist.insert([boundWitness.payload(), wrapper.payload()])

        const address = accountA.address
        const query: PayloadDivinerQueryPayload = { address, schema }
        const response = await diviner.divine([query])

        expect(response).toBeArray()
        expect(response.length).toBeGreaterThan(0)
      })
      it('divines Payloads by addresses', async () => {
        const wrapper: PayloadWrapper = PayloadWrapper.wrap(await getNewPayload())
        const boundWitness: BoundWitnessWrapper = BoundWitnessWrapper.parse((await getNewBoundWitness([accountA, accountB], [wrapper.payload()]))[0])
        await archivist.insert([boundWitness.payload(), wrapper.payload()])
        const address = [accountA.address, accountB.address] as unknown as (string | string[]) & (string | [string])
        const query: PayloadDivinerQueryPayload = { address: address, schema }
        const response = await diviner.divine([query])
        expect(response).toBeArray()
        expect(response.length).toBeGreaterThan(0)
      })
    })
    describe('hash', () => {
      const payload: Promise<PayloadWrapper> = (async () => PayloadWrapper.wrap(await getNewPayload()))()
      beforeAll(async () => {
        await archivist.insert([(await payload).payload()])
        const hash = await (await payload).hashAsync()
        const payloads = await archivist.get([hash])
        expect(payloads).toBeArrayOfSize(1)
      })
      it('divines Payloads by hash', async () => {
        const hash = await (await payload).hashAsync()
        const query: PayloadDivinerQueryPayload = { hash, schema }
        const response = await diviner.divine([query])
        expect(response).toBeArrayOfSize(1)
        const responseHashes = await Promise.all(response.map((p) => PayloadWrapper.hashAsync(p)))
        expect(responseHashes).toContainAllValues([await (await payload).hashAsync()])
      })
      it('returns empty array for non-existent hash', async () => {
        const hash = nonExistentHash
        const query: PayloadDivinerQueryPayload = { hash, schema }
        const response = await diviner.divine([query])
        expect(response).toBeArrayOfSize(0)
      })
    })
    describe('limit', () => {
      const schemaA = getTestSchemaName()
      const schemaB = getTestSchemaName()
      const payloadBaseA = (async () => ({...(await getNewPayload()), schema: schemaA}))()
      const payloadA: Promise<PayloadWrapper> = (async () => PayloadWrapper.wrap(await payloadBaseA))()
      const payloadBaseB = (async () => ({...(await getNewPayload()), schema: schemaB}))()
      const payloadB: Promise<PayloadWrapper> = (async () => PayloadWrapper.wrap(await payloadBaseB))()
      beforeAll(async () => {
        await archivist.insert([(await payloadA).jsonPayload(), (await payloadB).jsonPayload()])
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
      const schemaA = getTestSchemaName()
      const schemaB = getTestSchemaName()
      const payloadBaseA = (async () => ({...(await getNewPayload()), schema: schemaA}))()
      const payloadA: Promise<PayloadWrapper> = (async () => PayloadWrapper.wrap(await payloadBaseA))()
      const payloadBaseB = (async () => ({...(await getNewPayload()), schema: schemaB}))()
      const payloadB: Promise<PayloadWrapper> = (async () => PayloadWrapper.wrap(await payloadBaseB))()
      beforeAll(async () => {
        await archivist.insert([(await payloadA).jsonPayload(), (await payloadB).jsonPayload()])
      })
      describe('with single schema', () => {
        it('divines Payloads by schema', async () => {
          const payloads = [await payloadA]
          const schemas = payloads.map((p) => p.schema())
          const query: PayloadDivinerQueryPayload = { schema, schemas }
          const response = await diviner.divine([query])
          expect(response).toBeArrayOfSize(payloads.length)
          const responseHashes = await Promise.all(response.map((p) => PayloadWrapper.hashAsync(p)))
          expect(responseHashes).toContainAllValues(payloads.map((p) => p.hashSync()))
        })
      })
      describe('with multiple schemas', () => {
        it('divines Payloads by schema', async () => {
          const payloads = [await payloadA, await payloadB]
          const schemas = payloads.map((p) => p.schema())
          const query: PayloadDivinerQueryPayload = { schema, schemas }
          const response = await diviner.divine([query])
          expect(response).toBeArrayOfSize(payloads.length)
          const responseHashes = await Promise.all(response.map((p) => PayloadWrapper.hashAsync(p)))
          expect(responseHashes).toContainAllValues(payloads.map((p) => p.hashSync()))
        })
      })
    })
  })
})
