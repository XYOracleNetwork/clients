import type { NodeInstance } from '@xyo-network/node-model'

import { printTitle, stop } from '../../../../lib/index.js'

export const stopNode = async (_node: NodeInstance) => {
  printTitle('Stop Node')
  await stop()
}
