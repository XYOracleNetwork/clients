/* eslint-disable sonarjs/assertions-in-tests */
import type { JobQueue } from '@xyo-network/node-core-model'
import type { Job } from '@xyo-network/shared'
import {
  beforeEach, describe, it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { scheduleJobs } from '../scheduleJobs.js'

describe('scheduleJobs', () => {
  let jobQueue: JobQueue
  let jobs: Job[] = []
  beforeEach(() => {
    jobQueue = mock<JobQueue>()
    jobs = [mock<Job>()]
  })
  it('schedules the supplied jobs', async () => {
    await scheduleJobs(jobQueue, jobs)
  })
})
