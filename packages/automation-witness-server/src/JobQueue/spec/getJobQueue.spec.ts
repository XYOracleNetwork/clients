import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { getJobQueue } from '../getJobQueue.js'

describe('getJobQueue', () => {
  it('gets the job queue', async () => {
    const jobQueue = await getJobQueue()
    expect(jobQueue).toBeObject()
  })
})
