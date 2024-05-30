import { assertEx } from '@xylabs/assert'
import { getDefaultLogger } from '@xylabs/sdk-api-express-ecs'
import { ApiCallSchema, ApiUriTemplateCall } from '@xyo-network/api-call-witness'
import { asSentinelInstance } from '@xyo-network/sentinel-model'

import { getNode } from './getNode'

export const getTask = () => {
  const logger = getDefaultLogger()
  const call: ApiUriTemplateCall = { params: { symbol: 'XYLB' }, schema: ApiCallSchema }
  const task = async () => {
    try {
      logger.log('Reporting TZero Stock Prices')
      const node = await getNode()
      const sentinelInstance = asSentinelInstance(await node.resolve('ApiCallSentinel'))
      const sentinel = assertEx(sentinelInstance, () => 'ApiCallSentinel not found')
      await sentinel.report([call])
      logger.log('Reported TZero Stock Prices')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
