import { assertEx } from '@xylabs/assert'
import { container } from '@xyo-network/express-node-dependencies'
import { TYPES } from '@xyo-network/node-core-types'
import type { NodeInstance } from '@xyo-network/node-model'
import type { Application } from 'express'

export type XyoApplication = Application & {
  node: NodeInstance
}

export const addDependencies = (app: XyoApplication) => {
  app.node = assertEx(container.get<NodeInstance>(TYPES.Node), () => 'Missing Node')
}
