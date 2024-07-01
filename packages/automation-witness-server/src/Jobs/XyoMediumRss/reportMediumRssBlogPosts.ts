import { assertEx } from '@xylabs/assert'
import { Payload } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { JsonObject } from '@xylabs/object'

import { getBlogPostWitnessNode } from './getBlogPostWitnessNode'
import { isXmlWithMeta } from '@xyo-network/xml-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { getArchivist } from '../../Archivists'

// TODO: This should be a Sentinel that includes a diviner to itemize the individual blog posts
// and a sentinel to report the blog posts individually.  Right now we're doing it inline
// because if the sentinel reports all the values at once the HTTP request will be too large
// and we don't have a way to report individual results sequentially with a Sentinel.
// So in this method we're artificially limiting the number of blog posts that can be reported
// at once.
export const reportMediumRssBlogPosts = async (xml: Payload[]): Promise<Payload[]> => {
  const rss = xml.find(isXmlWithMeta)
  const items = (rss?.xml?.rss as { channel?: { item?: JsonObject[] } })?.channel?.item ?? []
  const ret: Payload[] = []
  if (items.length > 0) {
    const archivist = await getArchivist()
    const node = await getBlogPostWitnessNode()
    const sentinelInstance = asSentinelInstance(await node.resolve('ApiCallSentinel'))
    const sentinel = assertEx(sentinelInstance, () => 'ApiCallSentinel not found')
    for (const item of items) {
      const article = await PayloadBuilder.build({ ...item, schema: 'network.xyo.medium.rss.blog.post' })
      // Check for each article if it has already been reported
      const hash = await PayloadBuilder.dataHash(article)
      const existing = await archivist.get([hash])
      if (existing.length === 0) {
        const [bw, ...result] = await sentinel.report([article])
        ret.push(bw, ...result)
      }
    }
  }
  return ret
}
