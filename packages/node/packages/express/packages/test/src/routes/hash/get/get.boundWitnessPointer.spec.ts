import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import type { AccountInstance } from '@xyo-network/account'
import { Account } from '@xyo-network/account'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { BoundWitnessWrapper } from '@xyo-network/boundwitness-wrapper'
import type { Order } from '@xyo-network/diviner-payload-model'
import type {
  BoundWitnessPointerPayload,
  PayloadAddressRule,
  PayloadOrderRule,
  PayloadRule,
  PayloadSchemaRule,
} from '@xyo-network/node-core-model'
import { BoundWitnessPointerSchema } from '@xyo-network/node-core-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import {
  beforeAll, describe, expect, it,
} from 'vitest'

import {
  getHash, getNewBoundWitness, getNewPayload, getTestSchemaName, insertBlock, insertPayload,
} from '../../../testUtil/index.js'

const createPointer = async (
  addresses: string[][] = [],
  schemas: string[][] = [],
  order: Order = 'desc',
): Promise<string> => {
  const reference: PayloadRule[][] = []

  const schemaRules: PayloadSchemaRule[][] = schemas.map((rules) => {
    return rules.map((schema) => {
      return { schema }
    })
  })
  if (schemaRules.length > 0) reference.push(...schemaRules)

  const addressRules: PayloadAddressRule[][] = addresses.map((rules) => {
    return rules.map((address) => {
      return { address }
    })
  })
  if (addressRules.length > 0) reference.push(...addressRules)

  const timestampRule: PayloadOrderRule = { order }
  reference.push([timestampRule])

  const pointer = new PayloadBuilder<BoundWitnessPointerPayload>({ schema: BoundWitnessPointerSchema }).fields({ reference }).build()
  await insertPayload(pointer)
  return await PayloadBuilder.dataHash(pointer)
}

const expectError = (result: Payload, detail: string, status: string, title?: string) => {
  expect(result).toBeObject()
  const error = (result as unknown as { error: { detail: string; status: string; title?: string } }).error
  const expected = title
    ? {
        detail, status, title,
      }
    : { detail, status }
  expect(error).toEqual(expected)
}

const expectHashNotFoundError = (result: Payload) => {
  expectError(result, 'Hash not found', `${StatusCodes.NOT_FOUND}`)
}

const expectSchemaNotSuppliedError = (result: Payload) => {
  expectError(result, 'At least one schema must be supplied', `${StatusCodes.INTERNAL_SERVER_ERROR}`, 'Error')
}

describe('/:hash', () => {
  describe('return format is', () => {
    it('a single BoundWitness matching the pointer criteria', async () => {
      const account = await Account.random()
      const [bw, payloads] = await getNewBoundWitness([account])
      const blockResponse = await insertBlock(bw, account)
      expect(blockResponse.length).toBe(1)
      const expected = BoundWitnessWrapper.parse(bw).payload
      const pointerHash = await createPointer([[account.address]], [[payloads[0].schema]])
      const response = await getHash(pointerHash)
      expect(response).toBeTruthy()
      expect(Array.isArray(response)).toBe(false)
      expect(await PayloadWrapper.wrap(response).getValid()).toBeTrue()
      expect(PayloadBuilder.omitStorageMeta(response)).toEqual(expected)
    })
    it(`${ReasonPhrases.NOT_FOUND} if no BoundWitnesses match the criteria`, async () => {
      const result = await getHash('non_existent_hash')
      expectHashNotFoundError(result)
    })
  })
  describe('with rules for', () => {
    describe('address', () => {
      let accountA: AccountInstance
      let accountB: AccountInstance
      let accountC: AccountInstance
      let accountD: AccountInstance
      const payloads: Payload[] = []
      const bws: BoundWitness[] = []
      beforeAll(async () => {
        accountA = await Account.random()
        accountB = await Account.random()
        accountC = await Account.random()
        accountD = await Account.random()
        const [bwA, payloadsA] = await getNewBoundWitness([accountA])
        const [bwB, payloadsB] = await getNewBoundWitness([accountB])
        const [bwC, payloadsC] = await getNewBoundWitness([accountC])
        const [bwD, payloadsD] = await getNewBoundWitness([accountD])
        const [bwE, payloadsE] = await getNewBoundWitness([accountC, accountD])
        const [bwF, payloadsF] = await getNewBoundWitness([accountC])
        const [bwG, payloadsG] = await getNewBoundWitness([accountD])
        payloads.push(...payloadsA, ...payloadsB, ...payloadsC, ...payloadsD, ...payloadsE, ...payloadsF, ...payloadsG)
        bws.push(bwA, bwB, bwC, bwD, bwE, bwF, bwG)
        const blockResponse = await insertBlock(bws)
        expect(blockResponse.length).toBe(payloads.length)
      })
      describe('single address', () => {
        it.each([
          [() => [accountA, BoundWitnessWrapper.parse(bws[0]).payload] as const],
          [() => [accountB, BoundWitnessWrapper.parse(bws[1]).payload] as const],
        ])('returns BoundWitness signed by address', async (data) => {
          const [account, expected] = data()
          const pointerHash = await createPointer([[account.address]], [[payloads[0].schema]])
          const result = await getHash(pointerHash)
          expect(PayloadBuilder.omitStorageMeta(result)).toEqual(expected)
        })
      })
      describe('multiple address rules', () => {
        describe('combined serially', () => {
          it('returns BoundWitness signed by both addresses', async () => {
            const expected = BoundWitnessWrapper.parse(bws[4]).payload
            const pointerHash = await createPointer([[accountC.address], [accountD.address]], [[payloads[0].schema]])
            const result = await getHash(pointerHash)
            expect(PayloadBuilder.omitStorageMeta(result)).toEqual(expected)
          })
        })
        describe('combined in parallel', () => {
          it('returns BoundWitness signed by both address', async () => {
            const expected = BoundWitnessWrapper.parse(bws[4]).payload
            const pointerHash = await createPointer([[accountC.address, accountD.address]], [[payloads[0].schema]])
            const result = await getHash(pointerHash)
            expect(PayloadBuilder.omitStorageMeta(result)).toEqual(expected)
          })
        })
      })
      it('no matching address', async () => {
        const pointerHash = await createPointer([[(await Account.random()).address]], [[payloads[0].schema]])
        const result = await getHash(pointerHash)
        expectHashNotFoundError(result)
      })
    })
    describe('schema', () => {
      let account: AccountInstance
      const schemaA = getTestSchemaName()
      const schemaB = getTestSchemaName()
      // const schemaC = getTestSchemaName()
      // const schemaD = getTestSchemaName()
      const schemas = [schemaA, schemaB]
      let payloadA: PayloadWrapper
      let payloadB: PayloadWrapper
      const boundWitnesses: BoundWitness[] = []
      beforeAll(async () => {
        account = await Account.random()
        const payloadBaseA = { ...(getNewPayload()), schema: schemaA }
        payloadA = PayloadWrapper.wrap(payloadBaseA)
        const payloadBaseB = { ...(getNewPayload()), schema: schemaB }
        payloadB = PayloadWrapper.wrap(payloadBaseB)
        const [bwA] = await getNewBoundWitness([account], [payloadA.payload])
        await delay(100)
        const [bwB] = await getNewBoundWitness([account], [payloadB.payload])
        await delay(100)
        const [bwC] = await getNewBoundWitness([account], [payloadA.payload, payloadB.payload])
        await delay(100)
        const [bwD] = await getNewBoundWitness([account], [payloadB.payload])
        await delay(100)
        boundWitnesses.push(bwA, bwB, bwC, bwD)
        for (const bw of boundWitnesses) {
          await insertBlock([bw], account)
          await delay(2)
        }
        await delay(1000)
      })
      describe('single schema', () => {
        it.each([
          [schemaA, 2],
          [schemaB, 3],
        ])('returns BoundWitness of schema type [%s]', async (schema, expectedIndex) => {
          const expected = boundWitnesses[expectedIndex]
          console.log('expected', expected)
          const pointerHash = await createPointer([[account.address]], [[schema]])
          const result = await getHash(pointerHash)
          console.log('result', result)
          expect(PayloadBuilder.omitStorageMeta(result)).toEqual(expected)
        })
      })
      describe('multiple schema rules', () => {
        // NOTE: Currently we don't differentiate between serial vs parallel
        // combination of schemas but in the future we should change the contract
        // to mean something like "AND" vs "OR" combination of schemas. When we do
        // these tests will need to be updated to reflect that.
        describe('combined serially', () => {
          it('returns BoundWitness of Payloads with both schemas', async () => {
            const pointerHash = await createPointer([[account.address]], [[payloadA.schema(), payloadB.schema()]])
            const result = await getHash<BoundWitness>(pointerHash)
            expect(schemas).toIncludeAllMembers(result.payload_schemas)
          })
        })
        describe('combined in parallel', () => {
          it('returns BoundWitness of Payloads for both schemas', async () => {
            const pointerHash = await createPointer([[account.address]], [[payloadA.schema()], [payloadB.schema()]])
            const result = await getHash<BoundWitness>(pointerHash)
            expect(schemas).toIncludeAllMembers(result.payload_schemas)
          })
        })
      })
      it('no matching schema', async () => {
        const pointerHash = await createPointer([[account.address]], [['network.xyo.test']])
        const result = await getHash(pointerHash)
        expectHashNotFoundError(result)
      })
    })
    describe('timestamp direction', () => {
      let account: AccountInstance
      let bwA: BoundWitness
      let bwB: BoundWitness
      let bwC: BoundWitness
      let boundWitnesses: BoundWitness[]
      let expectedSchema: string
      beforeAll(async () => {
        account = await Account.random()
        let payloadsA: Payload[]
        ;[bwA, payloadsA] = await getNewBoundWitness([account])
        await delay(100)
        ;[bwB] = await getNewBoundWitness([account])
        await delay(100)
        ;[bwC] = await getNewBoundWitness([account])
        await delay(100)
        boundWitnesses = [bwA, bwB, bwC]
        expectedSchema = payloadsA[0].schema
        const insertedPayloads: Payload[] = []
        for (const bw of boundWitnesses) {
          const blockResponse = await insertBlock(bw, account)
          expect(blockResponse.length).toBe(1)
          insertedPayloads.push(...blockResponse)
        }
      })
      it('ascending', async () => {
        const expected = BoundWitnessWrapper.parse(assertEx(boundWitnesses.at(0))).payload
        const pointerHash = await createPointer([[account.address]], [[expectedSchema]], 'asc')
        const result = await getHash(pointerHash)
        expect(PayloadBuilder.omitStorageMeta(result)).toEqual(expected)
      })
      it('descending', async () => {
        const expected = BoundWitnessWrapper.parse(assertEx(boundWitnesses.at(-1))).payload
        const pointerHash = await createPointer([[account.address]], [[expectedSchema]], 'desc')
        const result = await getHash(pointerHash)
        expect(PayloadBuilder.omitStorageMeta(result)).toEqual(expected)
      })
    })
  })
  describe('with no rules', () => {
    it('returns error ', async () => {
      const pointerHash = await createPointer([], [])
      const result = await getHash(pointerHash)
      expectSchemaNotSuppliedError(result)
    })
  })
})
