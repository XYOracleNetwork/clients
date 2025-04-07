import { standardErrors } from '@xylabs/express'
import type { Express } from 'express'

export const addErrorHandlers = (app: Express) => {
  app.use(standardErrors)
}
