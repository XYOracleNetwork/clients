import type { MemoryNode } from '@xyo-network/node-memory'

import type { NodeConfigurationFunction } from '../../model/index.js'
import { configureExpressHttpTransport, configureFileTransport } from './providers/index.js'

export const configureTransports: NodeConfigurationFunction = async (node: MemoryNode) => {
  await configureFileTransport(node)
  await configureExpressHttpTransport(node)
}
