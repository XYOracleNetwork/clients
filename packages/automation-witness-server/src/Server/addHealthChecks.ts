import type { Express } from 'express'

export const addHealthChecks = (app: Express) => {
  app.get('/', (_req, res, next) => {
    res.json({ alive: true })
    next()
  })
  app.get('/healthz', (_req, res, next) => {
    res.json({ alive: true })
    next()
  })
  return app
}
