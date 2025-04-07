import type { Logger } from '@xylabs/express'
import { configureDependencies, container } from '@xyo-network/express-node-dependencies'
import { addRoutes } from '@xyo-network/express-node-routes'
import { TYPES } from '@xyo-network/node-core-types'
import { MemoryNode } from '@xyo-network/node-memory'
import type { NodeInstance } from '@xyo-network/node-model'
import compression from 'compression'
import cors from 'cors'
import type { Express } from 'express'
import express from 'express'

import { addDependencies } from './addDependencies.js'
import { addErrorHandlers } from './addErrorHandlers.js'
import { addMiddleware } from './addMiddleware.js'
import { configureEnvironment } from './configureEnvironment.js'
import { startJobQueue } from './startJobQueue.js'

const hostname = '::'

export abstract class PayloadTransport {
  constructor(protected readonly node: NodeInstance) {}
}

export class ExpressPayloadTransport extends PayloadTransport {
  private _app: Express = express()
  constructor(node: NodeInstance) {
    super(node)
    this.app.set('etag', false)
    this.app.use(cors())
    this.app.use(compression())
    addDependencies(this.app)
    addMiddleware(this.app)
    addRoutes(this.app)
    addErrorHandlers(this.app)
  }

  get app(): Express {
    return this._app
  }

  set app(v: Express) {
    this._app = v
  }
}

export const getApp = async (node?: NodeInstance): Promise<Express> => {
  node = node ?? (await MemoryNode.create({ account: 'random' }))
  await configureEnvironment()
  await configureDependencies(node)
  const transport = new ExpressPayloadTransport(node)
  return transport.app
}

export const getServer = async (port = 80, node?: MemoryNode) => {
  node = node ?? (await MemoryNode.create({ account: 'random' }))
  const app = await getApp(node)
  await startJobQueue()
  const logger = container.get(TYPES.Logger) as Logger
  const server = app.listen(port, hostname, () => logger.log(`Server listening at http://${hostname}:${port}`))
  server.setTimeout(20_000)
  return server
}
