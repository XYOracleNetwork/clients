import { assertEx } from '@xylabs/assert'
import { getDefaultLogger } from '@xylabs/express'
import { CryptoMarketAssetSchema } from '@xyo-network/crypto-asset-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Job } from '@xyo-network/shared'
import type { HashPayload } from '@xyo-network/xl1-model'
import { HashSchema } from '@xyo-network/xl1-model'

import { sendTransaction } from '../../Chain/index.ts'
import { getDiviner } from './getDiviner.ts'
import { reportCryptoPrices } from './reportCryptoPrices.ts'
import { reportDivinerResult } from './reportDivinerResult.ts'

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
      logger.log('Submit Transaction of Aggregated Crypto Prices')
      // NOTE: Create hash payload instead of non-elevated until validation passes for non-elevated
      const hash = await PayloadBuilder.hash(answer)
      const hashPayload = new PayloadBuilder<HashPayload>({ schema: HashSchema }).fields({ hash }).build()
      await sendTransaction([hashPayload], [])
      logger.log('Submitted Transaction of Aggregated Crypto Prices')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
