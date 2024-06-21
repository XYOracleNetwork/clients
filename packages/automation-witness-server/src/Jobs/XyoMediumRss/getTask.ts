import { getDefaultLogger } from '@xylabs/sdk-api-express-ecs'

import { reportMediumRssFeed } from './reportMediumRssFeeds'

export const getTask = () => {
  const logger = getDefaultLogger()
  const task = async () => {
    try {
      logger.log('Reporting XYO Medium RSS Feed')
      await reportMediumRssFeed('xyonetwork')
      logger.log('Reported XYO Medium RSS Feed')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
