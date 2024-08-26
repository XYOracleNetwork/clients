import type { Express } from 'express'

import { addDomainRoutes } from './addDomainRoutes.js'
import { addMetricsRoutes } from './addMetricsRoutes.js'
import { addNodeRoutes } from './addNodeRoutes.js'
import { addTempNodeRoutes } from './addTempNodeRoutes.js'

export const addRoutes = (app: Express): Express => {
  addDomainRoutes(app)
  addTempNodeRoutes(app)
  addMetricsRoutes(app)
  // This needs to be the last true route handler since it is
  // a catch-all for the root paths
  addNodeRoutes(app)
  return app
}
