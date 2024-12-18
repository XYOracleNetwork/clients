import { assertEx } from '@xylabs/assert'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { isSnapshot } from '@xyo-network/tzero-stock-market-payload-plugin'
import {
  describe, expect, it,
} from 'vitest'

import { getArchivist } from '../../../Archivists/index.js'
import { reportStockPrice } from '../reportStockPrices.js'

describe('reportStockPrices', () => {
  describe('reportStockPrice', () => {
    it('reports stock price', async () => {
      const result = await reportStockPrice('XYLB')
      expect(result).toBeArrayOfSize(2)
      const snapshot = result.find(isSnapshot)
      expect(snapshot).toBeDefined()
      if (snapshot) {
        expect(snapshot?.symbol).toBe('XYLB')
        expect(await PayloadBuilder.dataHash(snapshot)).toBeDefined()
        const hash = assertEx(await PayloadBuilder.dataHash(snapshot), () => 'Missing hash')
        const archivist = await getArchivist()
        expect(archivist).toBeDefined()
        const stored = await archivist.get([hash])
        expect(stored).toBeArray()
        expect(stored.length).toBeGreaterThan(0)
      }
    })
  })
})
