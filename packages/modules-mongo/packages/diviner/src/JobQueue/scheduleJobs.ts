import type { Job, JobQueue } from '@xyo-network/shared'

export const scheduleJobs = async (jobQueue: JobQueue, jobs: Job[]) => {
  // eslint-disable-next-line unicorn/no-array-method-this-argument
  await Promise.all(jobs.map(async job => await jobQueue.every(job.schedule, job.name)))
}
