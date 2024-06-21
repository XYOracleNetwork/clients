import { assertEx } from '@xylabs/assert'
import { ApiCallSchema, ApiUriTemplateCall } from '@xyo-network/api-call-witness'
import { Payload } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel'

import { getNode } from './getNode'

export const reportMediumRssFeed = async (feed: string): Promise<Payload[]> => {
  const call: ApiUriTemplateCall = { params: { feed }, schema: ApiCallSchema }
  const node = await getNode()
  const sentinelInstance = asSentinelInstance(await node.resolve('ApiCallSentinel'))
  const sentinel = assertEx(sentinelInstance, () => 'ApiCallSentinel not found')
  return await sentinel.report([call])
}

export const reportMediumRssFeeds = async (feeds: string[] = ['xyonetwork']): Promise<Payload[]> => {
  return (await Promise.all(feeds.map((symbol) => reportMediumRssFeed(symbol)))).flat()
}
