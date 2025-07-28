import { TYPES } from '@xyo-network/node-core-types'
import type { JobQueue } from '@xyo-network/shared'
import type { interfaces } from 'inversify'
import { ContainerModule } from 'inversify'

import { getJobQueue } from './getJobQueue.js'

export const JobQueueContainerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<JobQueue>(TYPES.JobQueue).toConstantValue(getJobQueue())
})
