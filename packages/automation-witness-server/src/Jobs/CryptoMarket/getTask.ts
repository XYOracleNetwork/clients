import { assertEx } from '@xylabs/assert'
import { getDefaultLogger } from '@xylabs/express'
import { CryptoMarketAssetSchema } from '@xyo-network/crypto-asset-payload-plugin'
import type { Job } from '@xyo-network/shared'

import { getDiviner } from './getDiviner.js'
import { reportCryptoPrices } from './reportCryptoPrices.js'
import { reportDivinerResult } from './reportDivinerResult.js'

export const getTask = (): Job['task'] => {
  const logger = getDefaultLogger()
  const task: Job['task'] = async () => {
    try {
      logger.log('Reporting Crypto Prices')
      const payloads = await reportCryptoPrices()
      logger.log('Reported Crypto Prices')
      logger.log('Divining Aggregated Crypto Prices')
      const diviner = await getDiviner()
      const results = await diviner.divine(payloads)
      const result = results.find(p => p.schema === CryptoMarketAssetSchema)
      const answer = assertEx(result, () => 'Empty CryptoMarketAssetPayload response from diviner')
      logger.log('Divined Aggregated Crypto Prices')
      logger.log('Reporting Aggregated Crypto Prices')
      await reportDivinerResult(answer)
      logger.log('Reported Aggregated Crypto Prices')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
