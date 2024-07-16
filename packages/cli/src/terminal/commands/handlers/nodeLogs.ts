import { NodeInstance } from '@xyo-network/node-model'

import { printOutFile, printTitle } from '../../../lib/index.js'

export const nodeLogs = async (_node: NodeInstance) => {
  printTitle('Node Logs')
  await printOutFile()
}
