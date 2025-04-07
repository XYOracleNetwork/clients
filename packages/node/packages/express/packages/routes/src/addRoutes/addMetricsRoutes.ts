import type { Express } from 'express'

import { getHealthz } from '../routes/index.js'
export const addMetricsRoutes = (app: Express) => {
  app.get(
    '/healthz',
    getHealthz,
    /* #swagger.tags = ['Health'] */
    /* #swagger.summary = 'Used for quick health check' */
  )
  app.get(
    '/ready',
    // TODO: Custom endpoint as readiness !== health
    getHealthz,
    /* #swagger.tags = ['Health'] */
    /* #swagger.summary = 'Used for readiness check' */
  )
}
