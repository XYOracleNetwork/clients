import type { Express } from 'express'

import { addDomainRoutes } from './addDomainRoutes.js'
import { addMetricsRoutes } from './addMetricsRoutes.js'
import { addNodeRoutes } from './addNodeRoutes.js'
import { addTempNodeRoutes } from './addTempNodeRoutes.js'
import { archivistMiddleware } from './archivistMiddleware.js'

export const addRoutes = (app: Express): Express => {
  const { node } = app
  const archivistModuleIdentifier = 'Chain:Finalized'
  addDomainRoutes(app)
  addTempNodeRoutes(app)
  addMetricsRoutes(app)
  app.use('/dataLake', archivistMiddleware({ node, archivistModuleIdentifier }))
  // This needs to be the last true route handler since it is
  // a catch-all for the root paths
  addNodeRoutes(app)

  return app
}
