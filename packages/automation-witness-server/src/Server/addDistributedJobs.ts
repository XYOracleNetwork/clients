import type { Express } from 'express'

import {
  defineJobs, getJobQueue, scheduleJobs, startJobQueue,
} from '../JobQueue/index.js'
import { getJobs } from '../Jobs/index.js'

export const addDistributedJobs = async (_app: Express) => {
  const jobQueue = await getJobQueue()
  const jobs = getJobs()
  defineJobs(jobQueue, jobs)
  await startJobQueue(jobQueue)
  await scheduleJobs(jobQueue, jobs)
}
