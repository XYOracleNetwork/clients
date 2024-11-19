import { Account } from '@xyo-network/account'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { Order } from '@xyo-network/diviner-payload-model'
import type {
  PayloadAddressRule,
  PayloadPointerPayload,
  PayloadRule,
  PayloadSchemaRule,
  PayloadTimestampOrderRule,
} from '@xyo-network/node-core-model'
import { PayloadPointerSchema } from '@xyo-network/node-core-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
  getHash, getNewBoundWitness, insertBlock, insertPayload,
} from '../../../testUtil/index.js'

export const createPointer = async (
  addresses: string[][] = [],
  schemas: string[][] = [],
  timestamp = Date.now(),
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

  const timestampRule: PayloadTimestampOrderRule = { order, timestamp }
  reference.push([timestampRule])

  const pointer = await new PayloadBuilder<PayloadPointerPayload>({ schema: PayloadPointerSchema }).fields({ reference }).build()
  const pointerResponse = await insertPayload(pointer)
  expect(pointerResponse).toBeArrayOfSize(1)
  return await PayloadBuilder.dataHash(pointer)
}

export const expectError = (result: Payload, detail: string, status: string, title?: string) => {
  expect(result).toBeObject()
  const body = result as unknown as { error: { detail: string; status: string; title?: string }[] }
  const error = body.error
  const expected = title
    ? {
        detail, status, title,
      }
    : { detail, status }
  expect(error).toEqual(expected)
}

export const expectHashNotFoundError = (result: Payload) => {
  expectError(result, 'Hash not found', `${StatusCodes.NOT_FOUND}`)
}

export const expectSchemaNotSuppliedError = (result: Payload) => {
  expectError(result, 'At least one schema must be supplied', `${StatusCodes.INTERNAL_SERVER_ERROR}`, 'Error')
}

describe('/:hash', () => {
  describe('return format is', () => {
    const account = Account.random()
    let bw: BoundWitness
    let payloads: Payload[]
    beforeAll(async () => {
      // Create data pointer will reference
      ;[bw, payloads] = await getNewBoundWitness([await account])
      const blockResponse = await insertBlock(bw, await account)
      expect(blockResponse.length).toBe(1)
      const payloadResponse = await insertPayload(payloads, await account)
      expect(payloadResponse.length).toBe(1)
    })
    it('a single Payload matching the pointer criteria', async () => {
      const expected = payloads[0]
      const pointerHash = await createPointer([[(await account).address]], [[expected.schema]])
      const response = await getHash(pointerHash)
      expect(response).toBeTruthy()
      expect(Array.isArray(response)).toBe(false)
      // expect(PayloadWrapper.parse(response).valid).toBeTrue()
      expect(response).toEqual(expected)
    })
    it(`${ReasonPhrases.NOT_FOUND} if no Payloads match the criteria`, async () => {
      const result = await getHash('non_existent_hash')
      expectHashNotFoundError(result)
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
