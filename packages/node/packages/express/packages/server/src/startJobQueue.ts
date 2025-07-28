import { container } from '@xyo-network/express-node-dependencies'
import { TYPES } from '@xyo-network/node-core-types'
import type { JobQueue } from '@xyo-network/shared'

export const startJobQueue = async () => {
  if (!container.isBound(TYPES.JobQueue)) return
  const jobQueue = container.get<JobQueue>(TYPES.JobQueue)
  await jobQueue.start()
}
