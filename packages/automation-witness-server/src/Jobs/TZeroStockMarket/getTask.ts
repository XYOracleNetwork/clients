import { getDefaultLogger } from '@xylabs/sdk-api-express-ecs'

import { reportStockPrice } from './reportStockPrices'

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
