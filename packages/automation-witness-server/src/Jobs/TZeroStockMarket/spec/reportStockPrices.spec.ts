import { assertEx } from '@xylabs/assert'
import { isSnapshotWithMeta } from '@xyo-network/tzero-stock-market-payload-plugin'

import { getArchivist } from '../../../Archivists/index.js'
import { reportStockPrice } from '../reportStockPrices.js'

describe('reportStockPrices', () => {
  describe('reportStockPrice', () => {
    it('reports stock price', async () => {
      const result = await reportStockPrice('XYLB')
      expect(result).toBeArrayOfSize(2)
      const snapshot = result.find(isSnapshotWithMeta)
      expect(snapshot).toBeDefined()
      expect(snapshot?.symbol).toBe('XYLB')
      expect(snapshot?.$hash).toBeDefined()
      const hash = assertEx(snapshot?.$hash, () => 'Missing hash')
      const archivist = await getArchivist()
      expect(archivist).toBeDefined()
      const stored = await archivist.get([hash])
      expect(stored).toBeArray()
      expect(stored.length).toBeGreaterThan(0)
    })
  })
})
