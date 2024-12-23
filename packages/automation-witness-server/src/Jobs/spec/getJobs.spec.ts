import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { getJobs } from '../getJobs.js'

describe('getJobs', () => {
  it('gets the jobs', () => {
    const jobs = getJobs()
    expect(jobs).toBeArray()
    expect(jobs.length).toBeGreaterThan(0)
  })
})
