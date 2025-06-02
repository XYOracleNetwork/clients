import { getDefaultLogger } from '@xylabs/express'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { HashPayload } from '@xyo-network/xl1-model'
import { HashSchema } from '@xyo-network/xl1-model'

import { sendTransaction } from '../../Chain/index.ts'
import { reportStockPrice } from './reportStockPrices.ts'

export const getTask = () => {
  const logger = getDefaultLogger()
  const task = async () => {
    try {
      logger.log('Reporting TZero Stock Prices')
      const result = await reportStockPrice('XYLB')
      logger.log('Reported TZero Stock Prices')
      logger.log('Submit Transaction of TZero Stock Prices')
      // NOTE: Create hash payload instead of non-elevated until validation passes for non-elevated
      const hashes = await Promise.all(result.map(p => PayloadBuilder.hash(p)))
      const hashPayloads = hashes.map(hash => new PayloadBuilder<HashPayload>({ schema: HashSchema }).fields({ hash }).build())
      const tx = await sendTransaction(hashPayloads, [])
      logger.log('Submitted Transaction of TZero Stock Prices', tx)
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
