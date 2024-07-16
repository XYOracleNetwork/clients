import { EmptyObject } from '@xylabs/object'
import { CommandBuilder, CommandModule } from 'yargs'

import { printError, printLine } from '../../../../lib/index.js'
import { BaseArguments } from '../../../BaseArguments.js'
import { getNode } from '../../../util/index.js'

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = {}
export const command = 'address'
export const deprecated = false
export const describe = 'Display the address of the XYO Node'
export const handler = async (argv: BaseArguments) => {
  const { verbose } = argv
  try {
    const node = await getNode(argv)
    printLine(node.address)
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Error Querying Node')
  }
}

const mod: CommandModule<EmptyObject, BaseArguments> = {
  aliases,
  command,
  deprecated,
  describe,
  handler,
}

// eslint-disable-next-line import/no-default-export
export default mod
