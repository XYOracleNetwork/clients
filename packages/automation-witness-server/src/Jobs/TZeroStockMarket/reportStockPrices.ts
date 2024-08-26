import { assertEx } from '@xylabs/assert'
import type { ApiUriTemplateCall } from '@xyo-network/api-call-witness'
import { ApiCallSchema } from '@xyo-network/api-call-witness'
import type { Payload } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'

import { getNode } from './getNode.js'

export const reportStockPrice = async (symbol: string): Promise<Payload[]> => {
  const call: ApiUriTemplateCall = { params: { symbol }, schema: ApiCallSchema }
  const node = await getNode()
  const sentinelInstance = asSentinelInstance(await node.resolve('ApiCallSentinel'))
  const sentinel = assertEx(sentinelInstance, () => 'ApiCallSentinel not found')
  return await sentinel.report([call])
}

export const reportStockPrices = async (symbols: string[] = ['XYLB']): Promise<Payload[]> => {
  return (await Promise.all(symbols.map(symbol => reportStockPrice(symbol)))).flat()
}
