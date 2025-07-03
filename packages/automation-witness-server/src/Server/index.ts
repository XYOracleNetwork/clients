import { getDefaultLogger } from '@xylabs/express'
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
  app.use(compression())
  addDependencies(app)
  addMiddleware(app)
  addHealthChecks(app)
  addErrorHandlers(app)
  return app
}

export const server = async (port = 80) => {
  const logger = getDefaultLogger()
  const app = getApp()
  await addDistributedJobs(app)
  const server = app.listen(port, () => {
    logger.log(`Server listening at http://localhost:${port}`)
  })

  server.setTimeout(3000)
}
