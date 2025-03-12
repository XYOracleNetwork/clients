import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { canAddMongoModules } from '../../canAddMongoModules.js'
import { getJobQueue } from '../getJobQueue.js'

describe.runIf(canAddMongoModules())('getJobQueue', () => {
  it('gets the job queue', () => {
    const jobQueue = getJobQueue()
    expect(jobQueue).toBeObject()
  })
})
