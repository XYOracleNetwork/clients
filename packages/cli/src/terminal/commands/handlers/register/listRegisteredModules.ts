import { NodeInstance } from '@xyo-network/node-model'

import { printLine, printTitle } from '../../../../lib'

export const listRegisteredModules = async (node: NodeInstance) => {
  printTitle('List Registered Modules')
  const addresses = await node.registered()
  for (const address of addresses) {
    printLine(`0x${address}`)
  }
}
