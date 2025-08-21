import type { Express } from 'express'

import { archivistMiddleware } from './archivistMiddleware.ts'

export const addDataLakeRoutes = (app: Express) => {
  const { node } = app
  const archivistModuleIdentifier = 'Chain:Finalized'
  app.use('/chain', archivistMiddleware({ node, archivistModuleIdentifier }))
}
