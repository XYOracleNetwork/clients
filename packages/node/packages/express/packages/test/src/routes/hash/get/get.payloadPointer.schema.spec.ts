import { Account } from '@xyo-network/account'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { Payload } from '@xyo-network/payload-model'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

import { getHash, getNewPayload, getTestSchemaName, insertPayload } from '../../../testUtil'
import { createPointer, expectHashNotFoundError } from './get.payloadPointer.spec'

describe('/:hash', () => {
  describe('with rules for [schema]', () => {
    const account = Account.randomSync()
    const schemaA = getTestSchemaName()
    const schemaB = getTestSchemaName()
    const payloadBaseA = (async () => ({ ...(await getNewPayload()), schema: schemaA }))()
    const payloadA: Promise<PayloadWrapper> = (async () => PayloadWrapper.wrap(await payloadBaseA))()
    const payloadBaseB = (async () => ({ ...(await getNewPayload()), schema: schemaB }))()
    const payloadB: Promise<PayloadWrapper> = (async () => PayloadWrapper.wrap(await payloadBaseB))()
    const schemas = [schemaA, schemaB]
    beforeAll(async () => {
      const [bw] = await (await new BoundWitnessBuilder().payloads([(await payloadA).jsonPayload(), (await payloadB).jsonPayload()]))
        .witness(account)
        .build()
      const payloads: Payload[] = [bw, (await payloadA).jsonPayload(), (await payloadB).jsonPayload()]
      const payloadResponse = await insertPayload(payloads, account)
      expect(payloadResponse.length).toBe(payloads.length)
    })
    describe('single schema', () => {
      it.each([
        [schemaA, payloadA],
        [schemaB, payloadB],
      ])('returns Payload of schema type', async (schema, expected) => {
        const pointerHash = await createPointer([[]], [[schema]])
        const result = await getHash(pointerHash)
        expect(result).toEqual((await expected).jsonPayload())
      })
    })
    describe('single schema [w/address]', () => {
      it.each([
        [schemaA, payloadA],
        [schemaB, payloadB],
      ])('returns Payload of schema type', async (schema, expected) => {
        const pointerHash = await createPointer([[account.address]], [[schema]])
        const result = await getHash(pointerHash)
        expect(result).toEqual((await expected).jsonPayload())
      })
    })
    describe('multiple schema rules', () => {
      describe('combined serially', () => {
        it('returns Payload of either schema', async () => {
          const pointerHash = await createPointer([[]], [[(await payloadA).schema(), (await payloadB).schema()]])
          const result = await getHash(pointerHash)
          expect(result).toBeDefined()
          expect(schemas).toContain(result.schema)
        })
      })
      describe('combined serially [w/address]', () => {
        it('returns Payload of either schema', async () => {
          const pointerHash = await createPointer([[account.address]], [[(await payloadA).schema(), (await payloadB).schema()]])
          const result = await getHash(pointerHash)
          expect(result).toBeDefined()
          expect(schemas).toContain(result.schema)
        })
      })
      describe('combined in parallel', () => {
        it('returns Payload of either schema', async () => {
          const pointerHash = await createPointer([[]], [[(await payloadA).schema()], [(await payloadB).schema()]])
          const result = await getHash(pointerHash)
          expect(schemas).toContain(result.schema)
        })
      })
      describe('combined in parallel [w/address]', () => {
        it('returns Payload of either schema', async () => {
          const pointerHash = await createPointer([[account.address]], [[(await payloadA).schema()], [(await payloadB).schema()]])
          const result = await getHash(pointerHash)
          expect(schemas).toContain(result.schema)
        })
      })
    })
    it('no matching schema', async () => {
      const pointerHash = await createPointer([[account.address]], [['network.xyo.test']])
      const result = await getHash(pointerHash)
      expectHashNotFoundError(result)
    })
  })
})
