import { getDefaultLogger } from '@xylabs/express'

import { reportStockPrice } from './reportStockPrices.js'

export const getTask = () => {
  const logger = getDefaultLogger()
  const task = async () => {
    try {
      logger.log('Reporting TZero Stock Prices')
      await reportStockPrice('XYLB')
      logger.log('Reported TZero Stock Prices')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
