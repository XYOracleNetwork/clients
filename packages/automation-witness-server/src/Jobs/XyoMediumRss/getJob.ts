import { Job } from '@xyo-network/shared'

import { getTask } from './getTask'

const name = 'xyoMediumRss'

export const getJob = (): Job => {
  const schedule: string = process.env.XYO_MEDIUM_RSS_WITNESS_SCHEDULE || '4 hours'
  const task = getTask()
  return { name, schedule, task }
}
