import { assertEx } from '@xylabs/assert'
import { Payload } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { JsonObject } from '@xylabs/object'

import { getBlogPostWitnessNode } from './getBlogPostWitnessNode'
import { isXmlWithMeta } from '@xyo-network/xml-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { getArchivist } from '../../Archivists'

export const reportMediumBlogPost = async (xml: Payload[]): Promise<Payload[]> => {
  const rss = xml.find(isXmlWithMeta)
  const items = (rss?.xml?.rss as { channel?: { item?: JsonObject[] } })?.channel?.item ?? []
  const ret: Payload[] = []
  if (items.length > 0) {
    const archivist = await getArchivist()
    const node = await getBlogPostWitnessNode()
    const sentinelInstance = asSentinelInstance(await node.resolve('ApiCallSentinel'))
    const sentinel = assertEx(sentinelInstance, () => 'ApiCallSentinel not found')
    for (const item of items) {
      const article = await PayloadBuilder.build({ ...item, schema: 'network.xyo.medium.blog.post' })
      // Check for each article if it has already been reported
      const hash = await PayloadBuilder.dataHash(article)
      const existing = await archivist.get([hash])
      if (existing.length === 0) {
        await sentinel.report([article])
        ret.push(article)
      }
    }
  }
  return ret
}
