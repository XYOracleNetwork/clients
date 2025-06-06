import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { getJob } from '../getJob.ts'

describe('getJob', () => {
  it('gets the job', () => {
    const job = getJob()
    expect(job).toBeObject()
    expect(job.name).toBeString()
    expect(job.schedule).toBeString()
    expect(job.task).toBeFunction()
  })
})
