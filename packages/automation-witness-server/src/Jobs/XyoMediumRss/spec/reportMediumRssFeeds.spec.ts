import { assertEx } from '@xylabs/assert'
import { isXmlWithMeta } from '@xyo-network/xml-plugin'

import { getArchivist } from '../../../Archivists'
import { reportMediumRssFeed } from '../reportMediumRssFeeds'

describe('reportStockPrices', () => {
  describe('reportStockPrice', () => {
    it('reports stock price', async () => {
      const result = await reportMediumRssFeed('xyonetwork')
      expect(result).toBeArrayOfSize(2)
      const snapshot = result.find(isXmlWithMeta)
      expect(snapshot).toBeDefined()
      expect(snapshot?.xml).toBeObject()
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
