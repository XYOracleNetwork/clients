import { isXmlWithMeta } from '@xyo-network/xml-plugin'

import { reportMediumRssFeed } from '../reportMediumRssFeeds.js'

describe('reportMediumRssFeeds', () => {
  describe('reportMediumRssFeed', () => {
    it('reports Medium RSS feed', async () => {
      const result = await reportMediumRssFeed('xyonetwork')
      expect(result).toBeArray()
      const snapshot = result.find(isXmlWithMeta)
      expect(snapshot).toBeDefined()
      expect(snapshot?.xml).toBeObject()
      expect(snapshot?.$hash).toBeDefined()
    })
  })
})
