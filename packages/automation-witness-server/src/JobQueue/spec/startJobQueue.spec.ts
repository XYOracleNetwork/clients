import type { JobQueue } from '@xyo-network/node-core-model'
import type { MockProxy } from 'jest-mock-extended'
import { mock } from 'jest-mock-extended'

import { startJobQueue } from '../startJobQueue.js'

describe('startJobQueue', () => {
  let jobQueue: MockProxy<JobQueue>
  beforeEach(() => {
    jobQueue = mock<JobQueue>()
  })
  it('starts the job queue', async () => {
    await startJobQueue(jobQueue)
    expect(jobQueue.start).toHaveBeenCalledOnce()
  })
})
