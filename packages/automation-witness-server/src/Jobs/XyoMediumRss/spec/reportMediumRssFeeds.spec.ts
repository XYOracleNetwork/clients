import { assertEx } from '@xylabs/assert'
import { isXmlWithMeta } from '@xyo-network/xml-plugin'

import { getArchivist } from '../../../Archivists'
import { reportMediumRssFeed } from '../reportMediumRssFeeds'

describe('reportMediumRssFeeds', () => {
  describe('reportMediumRssFeed', () => {
    it('reports Medium RSS feed', async () => {
      const result = await reportMediumRssFeed('xyonetwork')
      expect(result).toBeArray()
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
