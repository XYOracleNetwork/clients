import { MemoryNode } from '@xyo-network/node-memory'

import { NodeConfigurationFunction } from '../../model/index.js'
import { configureExpressHttpTransport, configureFileTransport } from './providers/index.js'

export const configureTransports: NodeConfigurationFunction = async (node: MemoryNode) => {
  await configureFileTransport(node)
  await configureExpressHttpTransport(node)
}
