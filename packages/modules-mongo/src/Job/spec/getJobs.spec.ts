import '@xylabs/vitest-extended'

import { TYPES } from '@xyo-network/node-core-types'
import type { Job } from '@xyo-network/shared'
import type { Container } from 'inversify'
import {
  describe, expect, it,
} from 'vitest'
import type { MockProxy } from 'vitest-mock-extended'
import { mock } from 'vitest-mock-extended'

import { getJobs } from '../getJobs.js'

describe('getJobs', () => {
  const container: MockProxy<Container> = mock<Container>({
    isBound(serviceIdentifier) {
      return serviceIdentifier === TYPES.JobQueue
    },
  })
  container.getAll.mockReturnValue([
    { jobs: [mock<Job>()] },
  ])
  it('gets the jobs', () => {
    const jobs = getJobs(container)
    expect(jobs).toBeArray()
    expect(jobs.length).toBeGreaterThan(0)
  })
})
