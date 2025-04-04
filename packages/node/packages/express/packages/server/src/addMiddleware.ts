import {
  customPoweredByHeader,
  disableCaseSensitiveRouting,
  disableExpressDefaultPoweredByHeader,
  getJsonBodyParser,
  getJsonBodyParserOptions,
  responseProfiler,
  useRequestCounters,
} from '@xylabs/express'
import { standardResponses } from '@xyo-network/express-node-middleware'
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
