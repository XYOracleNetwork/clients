import { NodeInstance } from '@xyo-network/node-model'

import { printLine, printTitle } from '../../../../lib'

export const listAttachedModules = async (node: NodeInstance) => {
  printTitle('List Attached Modules')

  const addresses = await node.attached()

  for (const address of addresses) {
    printLine(`0x${address}`)
  }
}
