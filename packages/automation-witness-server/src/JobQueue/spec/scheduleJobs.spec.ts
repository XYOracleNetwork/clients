import type { NodeJobQueue } from '@xyo-network/node-core-model'
import type { Job } from '@xyo-network/shared'
import {
  beforeEach, describe, it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { scheduleJobs } from '../scheduleJobs.js'

describe('scheduleJobs', () => {
  let jobQueue: NodeJobQueue
  let jobs: Job[] = []
  beforeEach(() => {
    jobQueue = mock<NodeJobQueue>()
    jobs = [mock<Job>()]
  })
  it('schedules the supplied jobs', async () => {
    await scheduleJobs(jobQueue, jobs)
  })
})
