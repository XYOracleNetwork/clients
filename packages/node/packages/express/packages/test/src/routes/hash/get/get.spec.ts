import { Account } from '@xyo-network/account'
import { type BoundWitness, isBoundWitness } from '@xyo-network/boundwitness-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { isAnyPayload, type Payload } from '@xyo-network/payload-model'
import type { BoundWitnessWithPartialMongoMeta } from '@xyo-network/payload-mongodb'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import {
  beforeAll, describe, expect, it, vi,
} from 'vitest'

import {
  getHash, getNewBlocksWithPayloads, getRequestClient, insertBlock, insertPayload,
} from '../../../testUtil/index.js'

describe('/:hash', () => {
  const account = Account.random()
  describe('with nonexistent hash', () => {
    beforeAll(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {
        // Stop expected errors from being logged
      })
    })
    it(`returns ${ReasonPhrases.NOT_FOUND}`, async () => {
      const hash = 'non_existent_hash'
      const response = await getRequestClient().get(`/${hash}`)
      expect(response.status).toBe(StatusCodes.NOT_FOUND)
    })
  })
  describe('return format is', () => {
    let boundWitness: BoundWitnessWithPartialMongoMeta
    let payload: Payload
    let boundWitnessHash: string
    let payloadHash: string
    beforeAll(async () => {
      const blocks = await getNewBlocksWithPayloads(2, 2)
      expect(blocks).toBeTruthy()
      boundWitness = blocks[0][0]
      expect(boundWitness).toBeTruthy()
      boundWitnessHash = await PayloadBuilder.dataHash(boundWitness)
      expect(boundWitnessHash).toBeTruthy()
      payload = blocks[0][1][0]
      expect(payload).toBeTruthy()
      payloadHash = boundWitness?.payload_hashes?.[0]
      expect(payloadHash).toBeTruthy()
      const boundWitnesses = blocks.map(([bw]) => bw)
      const blockResponse = await insertBlock(boundWitnesses)
      expect(blockResponse.length).toBe(blocks.length)
      const payloadResponse = await insertPayload(payload, await account)
      expect(payloadResponse.length).toBe(1)
    })
    it('a single bound witness', async () => {
      const response = await getHash(boundWitnessHash)
      expect(response).toBeTruthy()
      expect(Array.isArray(response)).toBe(false)
      expect(isBoundWitness(response)).toBe(true)
      const actual = response as BoundWitness
      expect(actual.addresses).toEqual(boundWitness.addresses)
      expect(actual.payload_hashes).toEqual(boundWitness.payload_hashes)
      expect(actual.payload_schemas).toEqual(boundWitness.payload_schemas)
      expect(actual.previous_hashes).toEqual(boundWitness.previous_hashes)
    })
    it('a single payload', async () => {
      const response = await getHash(payloadHash)
      expect(response).toBeTruthy()
      expect(Array.isArray(response)).toBe(false)
      expect(isAnyPayload(response)).toBe(true)
      const actual = response as Payload
      expect(actual.schema).toEqual(payload?.schema)
    })
  })
})
