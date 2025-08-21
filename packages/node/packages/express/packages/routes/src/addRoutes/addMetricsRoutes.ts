import type { Express } from 'express'

import { getHealthz } from '../routes/index.js'
export const addMetricsRoutes = (app: Express) => {
  app.get('/healthz', getHealthz)
  // TODO: Custom endpoint as readiness !== health
  app.get('/ready', getHealthz)
}
