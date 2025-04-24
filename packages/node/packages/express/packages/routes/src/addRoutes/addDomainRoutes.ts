import type { Express } from 'express'

import { getDomain } from '../routes/index.js'

export const addDomainRoutes = (app: Express) => {
  app.get(
    '/domain/:domain',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    getDomain,
  )
}
