import { MemoryNode } from '@xyo-network/node-memory'

import { NodeConfigurationFunction } from '../../../model/index.js'

export const configureFileTransport: NodeConfigurationFunction = (_node: MemoryNode) => {
  // TODO: Read in file of static commands
}
