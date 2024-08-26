import { standardErrors } from '@xylabs/sdk-api-express-ecs'
import type { Express } from 'express'

export const addErrorHandlers = (app: Express) => {
  app.use(standardErrors)
  return app
}
