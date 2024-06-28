import { getDefaultLogger } from '@xylabs/sdk-api-express-ecs'

import { reportMediumRssFeed } from './reportMediumRssFeeds'
import { getArchivist } from '../../Archivists'
import { Payload } from '@xyo-network/payload-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'

export const getTask = () => {
  const logger = getDefaultLogger()
  const task = async () => {
    try {
      logger.log('Reporting XYO Medium RSS Feed')
      const rss = await reportMediumRssFeed('xyonetwork')
      // TODO: Divine individual articles from the RSS feed
      const articles: Payload[] = []
      const uniqueArticles: Payload[] = []
      const archivist = await getArchivist()
      // Check for each article if it has already been reported
      for (const article of articles) {
        const hash = await PayloadBuilder.dataHash(article)
        const existing = await archivist.get([hash])
        if (existing.length === 0) {
          uniqueArticles.push(article)
        }
      }
      // Save individual articles to the archivist, one at
      // a time because of size constraints on the payload
      for (const article of uniqueArticles) {
        // TODO: Sentinel report the article
        // to ensure consistent address
      }
      logger.log('Reported XYO Medium RSS Feed')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
