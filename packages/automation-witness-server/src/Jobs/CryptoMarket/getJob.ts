import { Job } from '@xyo-network/shared'

import { getTask } from './getTask'
const name = 'cryptoMarketWitness'

export const getJob = (): Job => {
  const schedule: string = process.env.CRYPTO_MARKET_WITNESS_JOB_SCHEDULE || '10 minutes'
  const task: Job['task'] = getTask()
  return { name, schedule, task }
}
