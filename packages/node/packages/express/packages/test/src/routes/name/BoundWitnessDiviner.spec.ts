import { assertEx } from '@xylabs/assert'
import { Account } from '@xyo-network/account'
import type { AccountInstance } from '@xyo-network/account-model'
import type { ArchivistInstance } from '@xyo-network/archivist-model'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { BoundWitnessWrapper } from '@xyo-network/boundwitness-wrapper'
import type { BoundWitnessDivinerQueryPayload } from '@xyo-network/diviner-boundwitness-model'
import { BoundWitnessDivinerQuerySchema } from '@xyo-network/diviner-boundwitness-model'
import type { DivinerInstance } from '@xyo-network/diviner-model'
import { DivinerDivineQuerySchema } from '@xyo-network/diviner-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

import {
  getArchivistByName,
  getDivinerByName,
  getNewBoundWitness,
  getNewPayload,
  getTestSchemaName,
  nonExistentHash,
  unitTestSigningAccount,
  validateStateResponse,
} from '../../testUtil'

const schema = BoundWitnessDivinerQuerySchema

const moduleName = 'XYOPublic:BoundWitnessDiviner'
describe(`/${moduleName}`, () => {
  let account: AccountInstance
  let diviner: DivinerInstance
  let archivist: ArchivistInstance

  beforeAll(async () => {
    account = await unitTestSigningAccount()
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
    const accountA = Account.random()
    const accountB = Account.random()
    const boundWitnesses: BoundWitnessWrapper[] = []
    beforeAll(async () => {
      const boundWitnessA = BoundWitnessWrapper.parse((await getNewBoundWitness([await accountA], [await getNewPayload()]))[0])
      const boundWitnessB = BoundWitnessWrapper.parse((await getNewBoundWitness([await accountB], [await getNewPayload()]))[0])
      const boundWitnessC = BoundWitnessWrapper.parse(
        (await getNewBoundWitness([await accountA, await accountB], [await getNewPayload(), await getNewPayload()]))[0],
      )
      boundWitnesses.push(boundWitnessA, boundWitnessB, boundWitnessC)
      await archivist.insert(boundWitnesses.map(b => b.boundwitness))
    })
    describe('address', () => {
      const cases: [title: string, accounts: Promise<AccountInstance>[], expected: () => BoundWitnessWrapper[]][] = [
        ['single address returns boundWitnesses signed by address', [accountA], () => [boundWitnesses[0], boundWitnesses[2]]],
        ['single address returns boundWitnesses signed by address', [accountB], () => [boundWitnesses[1], boundWitnesses[2]]],
        ['multiple addresses returns boundWitnesses signed by both addresses', [accountA, accountB], () => [boundWitnesses[2]]],
        [
          'multiple addresses returns boundWitnesses signed by both addresses (independent of order)',
          [accountB, accountA],
          () => [boundWitnesses[2]],
        ],
      ]
      describe.each(cases)('with %s', (_title, addresses, data) => {
        it('divines BoundWitnesses by address', async () => {
          const expected = data().map(d => d.payload)
          const query: BoundWitnessDivinerQueryPayload = { addresses: (await Promise.all(addresses)).map(account => account.address), schema }
          const response = await diviner.divine([query])
          expect(response).toBeArrayOfSize(expected.length)
          const responseHashes = await PayloadBuilder.dataHashes(response)
          const expectedHashes = await PayloadBuilder.dataHashes(expected as Payload[])
          expect(responseHashes).toContainAllValues(expectedHashes ?? [])
        })
      })
    })
    describe('hash', () => {
      let boundWitness: BoundWitnessWrapper
      beforeAll(async () => {
        boundWitness = BoundWitnessWrapper.parse((await getNewBoundWitness([account]))[0])
        await archivist.insert([boundWitness.payload])
      })
      it('divines BoundWitnesses by hash', async () => {
        const hash = await boundWitness.dataHash()
        const query: BoundWitnessDivinerQueryPayload = { hash, schema }
        const response = await diviner.divine([query])
        expect(response).toBeArrayOfSize(1)
        const responseHashes = await PayloadBuilder.dataHashes(response)
        expect(responseHashes).toContainAllValues([await boundWitness.dataHash()])
      })
      it('returns empty array for non-existent hash', async () => {
        const hash = nonExistentHash
        const query: BoundWitnessDivinerQueryPayload = { hash, schema }
        const response = await diviner.divine([query])
        expect(response).toBeArrayOfSize(0)
      })
    })
    describe('dataHash', () => {
      let boundWitness: BoundWitnessWrapper
      beforeAll(async () => {
        boundWitness = BoundWitnessWrapper.parse((await getNewBoundWitness([account]))[0])
        await archivist.insert([boundWitness.payload])
      })
      it('divines BoundWitnesses by hash', async () => {
        const hash = await boundWitness.dataHash()
        const query: BoundWitnessDivinerQueryPayload = { hash, schema }
        const response = await diviner.divine([query])
        expect(response).toBeArrayOfSize(1)
        const responseHashes = await PayloadBuilder.dataHashes(response)
        expect(responseHashes).toContainAllValues([await boundWitness.dataHash()])
      })
      it('returns empty array for non-existent hash', async () => {
        const hash = nonExistentHash
        const query: BoundWitnessDivinerQueryPayload = { hash, schema }
        const response = await diviner.divine([query])
        expect(response).toBeArrayOfSize(0)
      })
    })
    describe('limit', () => {
      let boundWitnesses: BoundWitness[]
      beforeAll(async () => {
        boundWitnesses = [(await getNewBoundWitness())[0], (await getNewBoundWitness())[0]]
        await archivist.insert(boundWitnesses)
      })
      it.each([1, 2])('returns the specified number of BoundWitnesses', async (limit) => {
        const query: BoundWitnessDivinerQueryPayload = { limit, schema }
        const response = await diviner.divine([query])
        expect(response).toBeArrayOfSize(limit)
      })
    })
    describe('offset', () => {
      const account = Account.random()
      let boundWitnesses: BoundWitnessWrapper[]
      beforeAll(async () => {
        boundWitnesses = await Promise.all(
          [(await getNewBoundWitness([await account]))[0], (await getNewBoundWitness([await account]))[0]].map(bw => BoundWitnessWrapper.parse(bw)),
        )
        await archivist.insert(boundWitnesses.map(b => b.boundwitness))
      })
      describe('with timestamp', () => {
        it('divines BoundWitnesses from offset', async () => {
          const address = (await account).address
          const timestamp = assertEx(boundWitnesses.at(-1)?.boundwitness.timestamp, () => 'Missing timestamp in test BW') + 1
          const limit = boundWitnesses.length
          const query: BoundWitnessDivinerQueryPayload = {
            address, limit, schema, timestamp,
          }
          const response = await diviner.divine([query])
          expect(response).toBeArrayOfSize(boundWitnesses.length)
          const responseHashes = await PayloadBuilder.dataHashes(response)
          const expected = await Promise.all(boundWitnesses.map(p => p.dataHash()))
          expect(responseHashes).toContainAllValues(expected)
        })
      })
    })
    describe('order', () => {
      it.skip('divines BoundWitnesses in order', async () => {
        await Promise.resolve()
        throw new Error('Not Implemented')
      })
    })
    describe('payload_schemas', () => {
      const schemaA = getTestSchemaName()
      const schemaB = getTestSchemaName()
      // eslint-disable-next-line unicorn/no-unreadable-iife
      const payloadBaseA = (async () => ({ ...(await getNewPayload()), schema: schemaA }))()
      const payloadA: Promise<PayloadWrapper> = (async () => PayloadWrapper.wrap(await payloadBaseA))()
      // eslint-disable-next-line unicorn/no-unreadable-iife
      const payloadBaseB = (async () => ({ ...(await getNewPayload()), schema: schemaB }))()
      const payloadB: Promise<PayloadWrapper> = (async () => PayloadWrapper.wrap(await payloadBaseB))()
      const boundWitnesses: BoundWitnessWrapper[] = []
      beforeAll(async () => {
        const boundWitnessA = BoundWitnessWrapper.parse((await getNewBoundWitness([account], [(await payloadA).payload]))[0])
        const boundWitnessB = BoundWitnessWrapper.parse((await getNewBoundWitness([account], [(await payloadB).payload]))[0])
        const boundWitnessC = BoundWitnessWrapper.parse(
          (await getNewBoundWitness([account], [(await payloadA).payload, (await payloadB).payload]))[0],
        )
        boundWitnesses.push(boundWitnessA, boundWitnessB, boundWitnessC)
        await archivist.insert(boundWitnesses.map(b => b.payload))
      })
      const cases: [title: string, payload_schemas: string[], expected: () => BoundWitnessWrapper[]][] = [
        ['single schema', [schemaA], () => [boundWitnesses[0], boundWitnesses[2]]],
        ['single schema', [schemaB], () => [boundWitnesses[1], boundWitnesses[2]]],
        ['multiple schemas', [schemaA, schemaB], () => [boundWitnesses[2]]],
      ]
      describe.each(cases)('with %s', (_title, payload_schemas, data) => {
        it('divines BoundWitnesses that contain all of the supplied schemas in payload_schemas', async () => {
          const expected = data()
          const query: BoundWitnessDivinerQueryPayload = { payload_schemas, schema }
          const response = await diviner.divine([query])
          expect(response).toBeArrayOfSize(expected.length)
          const responseHashes = await PayloadBuilder.dataHashes(response)
          expect(responseHashes).toContainAllValues(await Promise.all(expected.map(p => p.dataHash())))
        })
      })
    })
  })
})
