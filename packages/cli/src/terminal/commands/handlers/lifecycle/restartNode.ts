import { NodeInstance } from '@xyo-network/node-model'

import { printTitle, restart } from '../../../../lib/index.js'

export const restartNode = async (_node: NodeInstance) => {
  printTitle('Restart Node')
  await restart()
}
