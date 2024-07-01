import { reportMediumRssFeed } from '../reportMediumRssFeeds'

describe('reportMediumRssFeeds', () => {
  describe('reportMediumRssFeed', () => {
    it('reports Medium RSS feed', async () => {
      const result = await reportMediumRssFeed('xyonetwork')
      expect(result).toBeArray()
    })
  })
})
