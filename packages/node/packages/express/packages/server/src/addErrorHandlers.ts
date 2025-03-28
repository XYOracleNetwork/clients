import { standardErrors } from '@xylabs/express'
import { getLoggingErrorHandler } from '@xyo-network/express-node-middleware'
import type { Express } from 'express'

export const addErrorHandlers = (app: Express) => {
  app.use(getLoggingErrorHandler(app.logger))
  app.use(standardErrors)
}
