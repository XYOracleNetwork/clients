import { getDefaultLogger } from '@xylabs/sdk-api-express-ecs'

import { reportMediumRssFeed } from './reportMediumRssFeeds'
import { reportMediumBlogPost } from './reportMediumBlogPost'

export const getTask = () => {
  const logger = getDefaultLogger()
  const task = async () => {
    try {
      logger.log('Reporting XYO Medium RSS Feed')
      const rss = await reportMediumRssFeed('xyonetwork')
      logger.log('Reported XYO Medium RSS Feed')
      logger.log('Reporting XYO Medium Articles')
      await reportMediumBlogPost(rss)
      logger.log('Reported XYO Medium Articles')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
