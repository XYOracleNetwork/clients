import '@xylabs/vitest-extended'

import { Account } from '@xyo-network/account'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import {
  beforeAll, describe, expect, it,
} from 'vitest'

import {
  getHash, getNewPayload, getTestSchemaName, insertPayload,
} from '../../../testUtil/index.js'
import { createPointer, expectHashNotFoundError } from './get.payloadPointer.spec.js'

describe('/:hash [with rules for schema]', () => {
  const account = Account.random()
  const schemaA = getTestSchemaName()
  const schemaB = getTestSchemaName()
  const payloadBaseA = { ...(getNewPayload()), schema: schemaA }
  const payloadA: PayloadWrapper = (() => PayloadWrapper.wrap(payloadBaseA))()
  const payloadBaseB = { ...(getNewPayload()), schema: schemaB }
  const payloadB: PayloadWrapper = (() => PayloadWrapper.wrap(payloadBaseB))()
  const schemas = [schemaA, schemaB]
  beforeAll(async () => {
    const [bw] = await new BoundWitnessBuilder()
      .payloads([(payloadA).payload, (payloadB).payload])
      .signer(await account)
      .build()
    const payloads: Payload[] = [bw, (payloadA).payload, (payloadB).payload]
    const payloadResponse = await insertPayload(payloads, await account)
    expect(payloadResponse.length).toBe(payloads.length)
  })
  describe('single schema', () => {
    it.each([
      [schemaA, payloadA],
      [schemaB, payloadB],
    ])('returns Payload of schema type', async (schema, expected) => {
      const pointerHash = await createPointer([[]], [[schema]])
      const result = await getHash(pointerHash)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(PayloadBuilder.omitStorageMeta(result)).toEqual((expected).payload as any)
    })
  })
  describe('single schema [w/address]', () => {
    it.each([
      [schemaA, payloadA],
      [schemaB, payloadB],
    ])('returns Payload of schema type', async (schema, expected) => {
      const pointerHash = await createPointer([[(await account).address]], [[schema]])
      const result = await getHash(pointerHash)
      const expectedPayload = (expected).payload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(`expectedPayload: ${(expectedPayload as any).$hash}`)
      console.log(JSON.stringify(expectedPayload, null, 2))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(`result: ${(result as any).$hash}`)
      const h1 = await PayloadBuilder.dataHash(expectedPayload)
      console.log(`h1: ${h1}`)
      const h2 = await PayloadBuilder.dataHash(result)
      console.log(`h2 ${h2}`)
      expect(PayloadBuilder.omitStorageMeta(result)).toEqual(expectedPayload)
    })
  })
  describe('multiple schema rules', () => {
    describe('combined serially', () => {
      it('returns Payload of either schema', async () => {
        const pointerHash = await createPointer([[]], [[(payloadA).schema(), (await payloadB).schema()]])
        const result = await getHash(pointerHash)
        expect(result).toBeDefined()
        expect(schemas).toContain(result.schema)
      })
    })
    describe('combined serially [w/address]', () => {
      it('returns Payload of either schema', async () => {
        const pointerHash = await createPointer([[(await account).address]], [[(await payloadA).schema(), (await payloadB).schema()]])
        const result = await getHash(pointerHash)
        expect(result).toBeDefined()
        expect(schemas).toContain(result.schema)
      })
    })
    describe('combined in parallel', () => {
      it('returns Payload of either schema', async () => {
        const pointerHash = await createPointer([[]], [[(payloadA).schema()], [(await payloadB).schema()]])
        const result = await getHash(pointerHash)
        expect(schemas).toContain(result.schema)
      })
    })
    describe('combined in parallel [w/address]', () => {
      it('returns Payload of either schema', async () => {
        const pointerHash = await createPointer([[(await account).address]], [[(await payloadA).schema()], [(await payloadB).schema()]])
        const result = await getHash(pointerHash)
        expect(schemas).toContain(result.schema)
      })
    })
  })
  it('no matching schema', async () => {
    const pointerHash = await createPointer([[(await account).address]], [['network.xyo.test']])
    const result = await getHash(pointerHash)
    expectHashNotFoundError(result)
  })
})
