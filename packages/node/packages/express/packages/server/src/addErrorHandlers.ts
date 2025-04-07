import { getLoggingErrorHandler, standardErrors } from '@xylabs/express'
import type { Express } from 'express'

export const addErrorHandlers = (app: Express) => {
  app.use(getLoggingErrorHandler(app.logger))
  app.use(standardErrors)
}
