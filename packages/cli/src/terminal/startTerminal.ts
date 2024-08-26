import type { NodeInstance } from '@xyo-network/node-model'

import { getCommand } from './getCommand.js'
import { stopTerminal } from './stopTerminal.js'

export const startTerminal = async (node: NodeInstance) => {
  let running = true
  while (running) {
    running = await getCommand(node)
  }
  stopTerminal()
}
