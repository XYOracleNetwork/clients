import '@xylabs/vitest-extended'

import { PayloadBuilder } from '@xyo-network/payload-builder'
import { isSnapshot } from '@xyo-network/tzero-stock-market-payload-plugin'
import {
  describe, expect, it,
} from 'vitest'

import { reportStockPrice } from '../reportStockPrices.ts'

describe('reportStockPrices', { timeout: 30_000 }, () => {
  describe('reportStockPrice', { timeout: 30_000 }, () => {
    it('reports stock price', { timeout: 30_000 }, async () => {
      const result = await reportStockPrice('XYLB')
      expect(result).toBeArrayOfSize(2)
      const snapshot = result.find(isSnapshot)
      expect(snapshot).toBeDefined()
      if (snapshot) {
        expect(snapshot?.symbol).toBe('XYLB')
        expect(await PayloadBuilder.dataHash(snapshot)).toBeDefined()
      }
    })
  })
})
