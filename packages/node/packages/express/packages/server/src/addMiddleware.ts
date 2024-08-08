import {
  customPoweredByHeader,
  disableCaseSensitiveRouting,
  disableExpressDefaultPoweredByHeader,
  getJsonBodyParser,
  getJsonBodyParserOptions,
  responseProfiler,
  useRequestCounters,
} from '@xylabs/sdk-api-express-ecs'
import { standardResponses } from '@xyo-network/express-node-middleware'
import { Express } from 'express'

export const addMiddleware = (app: Express) => {
  app.use(responseProfiler)
  app.use(getJsonBodyParser(getJsonBodyParserOptions({ limit: '1mb' })))
  app.use(standardResponses)
  disableExpressDefaultPoweredByHeader(app)
  app.use(customPoweredByHeader)
  disableCaseSensitiveRouting(app)
  useRequestCounters(app)
}
