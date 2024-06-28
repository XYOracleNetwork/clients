import { getDefaultLogger } from '@xylabs/sdk-api-express-ecs'

import { reportMediumRssFeed } from './reportMediumRssFeeds'
import { getArchivist } from '../../Archivists'
import { Payload } from '@xyo-network/payload-model'

export const getTask = () => {
  const logger = getDefaultLogger()
  const task = async () => {
    try {
      logger.log('Reporting XYO Medium RSS Feed')
      const rss = await reportMediumRssFeed('xyonetwork')
      // TODO: Divine individual articles from the RSS feed
      const articles: Payload[] = []
      // Save individual articles to the archivist, one at
      // a time because of size constraints on the payload
      const archivist = await getArchivist()
      for (const article of articles) {
        await archivist.insert([article])
      }
      logger.log('Reported XYO Medium RSS Feed')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
