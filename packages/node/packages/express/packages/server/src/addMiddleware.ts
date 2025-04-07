import {
  customPoweredByHeader,
  disableCaseSensitiveRouting,
  disableExpressDefaultPoweredByHeader,
  getJsonBodyParser,
  getJsonBodyParserOptions,
  responseProfiler,
  standardResponses,
  useRequestCounters,
} from '@xylabs/express'
import type { Express } from 'express'

export const addMiddleware = (app: Express) => {
  app.use(responseProfiler)
  app.use(getJsonBodyParser(getJsonBodyParserOptions({ limit: '1mb' })))
  app.use(standardResponses)
  disableExpressDefaultPoweredByHeader(app)
  app.use(customPoweredByHeader)
  disableCaseSensitiveRouting(app)
  useRequestCounters(app)
}
