import { Job } from '@xyo-network/shared'

import { getTask } from './getTask.js'

const name = 'tZeroStockPriceWitness'

export const getJob = (): Job => {
  const schedule: string = process.env.TZERO_STOCK_MARKET_WITNESS_JOB_SCHEDULE || '10 minutes'
  const task = getTask()
  return { name, schedule, task }
}
