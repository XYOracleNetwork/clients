import {
  describe, expect, it,
} from 'vitest'

import { getJob } from '../getJob.js'

describe('getJob', () => {
  it('gets the job', () => {
    const job = getJob()
    expect(job).toBeObject()
    expect(job.name).toBeString()
    expect(job.schedule).toBeString()
    expect(job.task).toBeFunction()
  })
})
