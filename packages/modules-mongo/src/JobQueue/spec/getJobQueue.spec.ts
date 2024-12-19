import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { canAddMongoModules } from '../../canAddMongoModules.js'
import { getJobQueue } from '../getJobQueue.js'

describe.runIf(canAddMongoModules())('getJobQueue', () => {
  it('gets the job queue', async () => {
    const jobQueue = await getJobQueue()
    expect(jobQueue).toBeObject()
  })
})
