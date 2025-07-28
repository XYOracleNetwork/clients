import type { NodeJobQueue } from '@xyo-network/node-core-model'
import type { Job } from '@xyo-network/shared'
import {
  beforeEach, describe, it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { defineJobs } from '../defineJobs.js'

describe('defineJobs', () => {
  let jobQueue: NodeJobQueue
  let jobs: Job[] = []
  beforeEach(() => {
    jobQueue = mock<NodeJobQueue>()
    jobs = [mock<Job>()]
  })
  it('defines the supplied jobs', () => {
    defineJobs(jobQueue, jobs)
  })
})
