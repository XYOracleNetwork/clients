import type { NodeJobQueue } from '@xyo-network/node-core-model'
import type { Job } from '@xyo-network/shared'
import type { DefineOptions } from 'agenda'

// TODO: Depends on job schedule, calculate dynamically
// to something like 25% of schedule to allow for retries
const options: DefineOptions = { lockLifetime: 10_000 }

export const defineJobs = (jobQueue: NodeJobQueue, jobs: Job[]) => {
  for (const job of jobs) jobQueue.define(job.name, options, job.task)
}
