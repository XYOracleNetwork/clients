/* eslint-disable sonarjs/assertions-in-tests */
import type { JobQueue } from '@xyo-network/node-core-model'
import type { Job } from '@xyo-network/shared'
import {
  beforeEach, describe, it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { defineJobs } from '../defineJobs.js'

describe('defineJobs', () => {
  let jobQueue: JobQueue
  let jobs: Job[] = []
  beforeEach(() => {
    jobQueue = mock<JobQueue>()
    jobs = [mock<Job>()]
  })
  it('defines the supplied jobs', () => {
    defineJobs(jobQueue, jobs)
  })
})
