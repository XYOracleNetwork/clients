import type { NodeJobQueue } from '@xyo-network/node-core-model'
import type { Job } from '@xyo-network/shared'

export const scheduleJobs = async (jobQueue: NodeJobQueue, jobs: Job[]) => {
  // eslint-disable-next-line unicorn/no-array-method-this-argument
  await Promise.all(jobs.map(async job => await jobQueue.every(job.schedule, job.name)))
}
