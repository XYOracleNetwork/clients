/* eslint-disable sonarjs/assertions-in-tests */
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
  beforeAll, describe, expect, it,
} from 'vitest'

import {
  getArchivistByName,
  getDivinerByName,
  getNewBoundWitness,
  getNewPayload,
  getTestSchemaName,
  unitTestSigningAccount,
  validateStateResponse,
} from '../../testUtil/index.ts'

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
    let accountA: AccountInstance
    let accountB: AccountInstance
    const boundWitnesses: BoundWitnessWrapper[] = []
    beforeAll(async () => {
      accountA = await Account.random()
      accountB = await Account.random()
      const boundWitnessA = BoundWitnessWrapper.parse((await getNewBoundWitness([accountA], [getNewPayload()]))[0])
      const boundWitnessB = BoundWitnessWrapper.parse((await getNewBoundWitness([accountB], [getNewPayload()]))[0])
      const boundWitnessC = BoundWitnessWrapper.parse(
        (await getNewBoundWitness([accountA, accountB], [getNewPayload(), getNewPayload()]))[0],
      )
      boundWitnesses.push(boundWitnessA, boundWitnessB, boundWitnessC)
      await archivist.insert(boundWitnesses.map(b => b.boundwitness))
    })
    describe('address', () => {
      const cases: [title: string, accounts: () => AccountInstance[], expected: () => BoundWitnessWrapper[]][] = [
        ['single address returns boundWitnesses signed by address', () => [accountA], () => [boundWitnesses[0], boundWitnesses[2]]],
        ['single address returns boundWitnesses signed by address', () => [accountB], () => [boundWitnesses[1], boundWitnesses[2]]],
        ['multiple addresses returns boundWitnesses signed by both addresses', () => [accountA, accountB], () => [boundWitnesses[2]]],
        [
          'multiple addresses returns boundWitnesses signed by both addresses (independent of order)',
          () => [accountB, accountA],
          () => [boundWitnesses[2]],
        ],
      ]
      describe.each(cases)('with %s', (_title, addresses, data) => {
        it('divines BoundWitnesses by address', async () => {
          const expected = data().map(d => d.payload)
          const query: BoundWitnessDivinerQueryPayload = { addresses: addresses().map(account => account.address), schema }
          const response = await diviner.divine([query])
          expect(response).toBeArrayOfSize(expected.length)
          const responseHashes = await PayloadBuilder.dataHashes(response)
          const expectedHashes = await PayloadBuilder.dataHashes(expected as Payload[])
          expect(responseHashes).toContainAllValues(expectedHashes ?? [])
        })
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
      let account: AccountInstance
      let boundWitnesses: BoundWitnessWrapper[]
      beforeAll(async () => {
        account = await Account.random()
        boundWitnesses = await Promise.all(
          [
            (await getNewBoundWitness([account]))[0],
            (await getNewBoundWitness([account]))[0],
          ].map(bw => BoundWitnessWrapper.parse(bw)),
        )
        await archivist.insert(boundWitnesses.map(b => b.boundwitness))
      })
      describe('with timestamp', () => {
        it('divines BoundWitnesses from offset', async () => {
          const address = account.address
          const limit = boundWitnesses.length
          const query: BoundWitnessDivinerQueryPayload = {
            address, limit, schema, order: 'asc',
          }
          const response = await diviner.divine([query])
          expect(response).toBeArrayOfSize(boundWitnesses.length)
          const responseHashes = await PayloadBuilder.dataHashes(response)
          const expected = await Promise.all(boundWitnesses.map(p => p.dataHash()))
          expect(responseHashes).toContainAllValues(expected)
        })
        it('divines BoundWitnesses from offset', async () => {
          const address = account.address
          const limit = boundWitnesses.length
          const query: BoundWitnessDivinerQueryPayload = {
            address, limit, schema, order: 'desc',
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
      const payloadBaseA = { ...getNewPayload(), schema: schemaA }
      const payloadA: PayloadWrapper = PayloadWrapper.wrap(payloadBaseA)
      const payloadBaseB = { ...getNewPayload(), schema: schemaB }
      const payloadB: PayloadWrapper = PayloadWrapper.wrap(payloadBaseB)
      const boundWitnesses: BoundWitnessWrapper[] = []
      beforeAll(async () => {
        const boundWitnessA = BoundWitnessWrapper.parse((await getNewBoundWitness([account], [payloadA.payload]))[0])
        const boundWitnessB = BoundWitnessWrapper.parse((await getNewBoundWitness([account], [payloadB.payload]))[0])
        const boundWitnessC = BoundWitnessWrapper.parse(
          (await getNewBoundWitness([account], [payloadA.payload, payloadB.payload]))[0],
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
