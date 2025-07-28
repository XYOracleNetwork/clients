import type { NodeJobQueue } from '@xyo-network/node-core-model'
import type { Job } from '@xyo-network/shared'

// TODO: Depends on job schedule, calculate dynamically
// to something like 25% of schedule to allow for retries
const options = { lockLifetime: 10_000 }

export const defineJobs = (jobQueue: NodeJobQueue, jobs: Job[]) => {
  for (const job of jobs) {
    const { name, task } = job
    jobQueue.define(name, options, task)
    if (job.onComplete) jobQueue.on(`complete:${name}`, job.onComplete)
    if (job.onFail) jobQueue.on(`fail:${name}`, job.onFail)
    if (job.onStart) jobQueue.on(`start:${name}`, job.onStart)
    if (job.onSuccess) jobQueue.on(`success:${name}`, job.onSuccess)
  }
}
