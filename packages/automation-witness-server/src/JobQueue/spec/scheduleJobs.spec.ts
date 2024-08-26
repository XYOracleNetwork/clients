import type { JobQueue } from '@xyo-network/node-core-model'
import type { Job } from '@xyo-network/shared'
import type { MockProxy } from 'jest-mock-extended'
import { mock } from 'jest-mock-extended'

import { scheduleJobs } from '../scheduleJobs.js'

describe('scheduleJobs', () => {
  let jobQueue: MockProxy<JobQueue>
  let jobs: Job[] = []
  beforeEach(() => {
    jobQueue = mock<JobQueue>()
    jobs = [mock<Job>()]
  })
  it('schedules the supplied jobs', async () => {
    await scheduleJobs(jobQueue, jobs)
  })
})
