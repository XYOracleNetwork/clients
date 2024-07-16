import { Express } from 'express'

import { getDomain } from '../routes/index.js'

export const addDomainRoutes = (app: Express) => {
  app.get(
    '/domain/:domain',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    getDomain,
    /* #swagger.tags = ['Domain'] */
    /* #swagger.summary = 'Get specific config for a specific domain' */
  )
}
