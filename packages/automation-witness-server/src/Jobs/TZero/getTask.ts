import { getDefaultLogger } from '@xylabs/sdk-api-express-ecs'
import { Job } from '@xyo-network/shared'

export const getTask = (): Job['task'] => {
  const logger = getDefaultLogger()
  const task: Job['task'] = async () => {
    try {
      logger.log('Reporting TZero Stock Prices')
      await Promise.resolve()
      logger.log('Reported TZero Stock Prices')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
