import { describeIf } from '@xylabs/jest-helpers'

import { canAddMongoModules } from '../../canAddMongoModules.js'
import { getJobQueue } from '../getJobQueue.js'

describeIf(canAddMongoModules())('getJobQueue', () => {
  it('gets the job queue', async () => {
    const jobQueue = await getJobQueue()
    expect(jobQueue).toBeObject()
  })
})
