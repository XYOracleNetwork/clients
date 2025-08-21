import type { Express } from 'express'

import { getDomain } from '../routes/index.js'

export const addDomainRoutes = (app: Express) => {
  app.get('/domain/:domain', getDomain)
}
