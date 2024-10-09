import { getDefaultLogger, getEnvFromAws } from '@xylabs/sdk-api-express-ecs'
import compression from 'compression'
import cors from 'cors'
import type { Express } from 'express'
import express from 'express'

import { addDependencies } from './addDependencies.js'
import { addDistributedJobs } from './addDistributedJobs.js'
import { addErrorHandlers } from './addErrorHandlers.js'
import { addHealthChecks } from './addHealthChecks.js'
import { addMiddleware } from './addMiddleware.js'

export const getApp = (): Express => {
  const app = express()
  app.set('etag', false)
  app.use(cors())
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.use(compression())
  addDependencies(app)
  addMiddleware(app)
  addHealthChecks(app)
  addErrorHandlers(app)
  return app
}

export const server = async (port = 80) => {
  // If an AWS ARN was supplied for Secrets Manager
  const awsEnvSecret = process.env.AWS_ENV_SECRET_ARN
  if (awsEnvSecret) {
    // Merge the values from AWS into the current ENV
    // with AWS taking precedence
    const awsEnv = await getEnvFromAws(awsEnvSecret)
    Object.assign(process.env, awsEnv)
  }

  const logger = getDefaultLogger()
  const app = getApp()
  await addDistributedJobs(app)
  const server = app.listen(port, () => {
    logger.log(`Server listening at http://localhost:${port}`)
  })

  server.setTimeout(3000)
}
