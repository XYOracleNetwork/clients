import { getDefaultLogger } from '@xylabs/express'

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
      await sendTransaction([], result)
      logger.log('Submitted Transaction of TZero Stock Prices')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
