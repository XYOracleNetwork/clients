import type { NodeJobQueue } from '@xyo-network/node-core-model'
import {
  beforeEach, describe, expect,
  it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { startJobQueue } from '../startJobQueue.js'

describe('startJobQueue', () => {
  let jobQueue: NodeJobQueue
  beforeEach(() => {
    jobQueue = mock<NodeJobQueue>()
  })
  it('starts the job queue', async () => {
    await startJobQueue(jobQueue)
    expect(jobQueue.start).toHaveBeenCalledOnce()
  })
})
