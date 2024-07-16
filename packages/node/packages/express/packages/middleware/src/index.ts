import { Logger } from '@xylabs/logger'
import { NodeInstance } from '@xyo-network/node-model'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      logger: Logger
      node: NodeInstance
    }
  }
}

export * from './doc/index.js'
export * from './LoggingErrorHandler/index.js'
export * from './nodeEnv/index.js'
export * from './standardResponses/index.js'
