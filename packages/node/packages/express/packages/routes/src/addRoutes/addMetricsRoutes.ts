import type { Express } from 'express'

import { getHealthz } from '../routes/index.js'
export const addMetricsRoutes = (app: Express) => {
  app.get(
    '/healthz',
    getHealthz,
  )
  app.get(
    '/ready',
    // TODO: Custom endpoint as readiness !== health
    getHealthz,
  )
}
