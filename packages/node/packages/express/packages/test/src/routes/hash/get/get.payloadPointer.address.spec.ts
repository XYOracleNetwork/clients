import { Account } from '@xyo-network/account'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import {
  beforeAll, describe, expect, it,
} from 'vitest'

import {
  getHash, getNewBoundWitness, insertBlock, insertPayload,
} from '../../../testUtil/index.js'
import { createPointer, expectHashNotFoundError } from './get.payloadPointer.spec.js'

describe('/:hash', () => {
  describe('with rules for [address]', () => {
    const accountA = Account.random()
    const accountB = Account.random()
    const accountC = Account.random()
    const accountD = Account.random()
    const payloads: Payload[] = []
    beforeAll(async () => {
      const [bwA, payloadsA] = await getNewBoundWitness([await accountA])
      const [bwB, payloadsB] = await getNewBoundWitness([await accountB])
      const [bwC, payloadsC] = await getNewBoundWitness([await accountC])
      const [bwD, payloadsD] = await getNewBoundWitness([await accountD])
      const [bwE, payloadsE] = await getNewBoundWitness([await accountC, await accountD])
      const [bwF, payloadsF] = await getNewBoundWitness([await accountC])
      const [bwG, payloadsG] = await getNewBoundWitness([await accountD])
      payloads.push(...payloadsA, ...payloadsB, ...payloadsC, ...payloadsD, ...payloadsE, ...payloadsF, ...payloadsG)
      const boundWitnesses = [bwA, bwB, bwC, bwD, bwE, bwF, bwG]
      const blockResponse = await insertBlock(boundWitnesses)
      expect(blockResponse.length).toBe(boundWitnesses.length)
      const payloadResponse = await insertPayload(payloads)
      expect(payloadResponse.length).toBe(payloads.length)
    })
    describe('single address', () => {
      it.each([
        [accountA, () => payloads[0]],
        [accountB, () => payloads[1]],
      ])('returns Payload signed by address', async (account, getData) => {
        const expected = getData()
        const pointerHash = await createPointer([[(await account).address]], [[expected.schema]])
        const result = await getHash(pointerHash)
        expect(PayloadBuilder.omitStorageMeta(result)).toEqual(expected)
      })
    })
    describe('multiple address rules', () => {
      describe('combined serially', () => {
        it('returns Payload signed by both addresses', async () => {
          const expected = payloads[4]
          const pointerHash = await createPointer([[(await accountC).address], [(await accountD).address]], [[expected.schema]])
          const result = await getHash(pointerHash)
          expect(PayloadBuilder.omitStorageMeta(result)).toEqual(expected)
        })
      })
      describe('combined in parallel', () => {
        it('returns Payload signed by both address', async () => {
          const expected = payloads[4]
          const pointerHash = await createPointer([[(await accountC).address, (await accountD).address]], [[expected.schema]])
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
})
