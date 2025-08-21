import type { Express } from 'express'

import { archivistMiddleware } from './archivistMiddleware.ts'

export const addDataLakeRoutes = (app: Express) => {
  const { node } = app
  const archivistModuleIdentifier = 'XYOPublic:Archivist'
  app.use('/dataLake', archivistMiddleware({ node, archivistModuleIdentifier }))
}
