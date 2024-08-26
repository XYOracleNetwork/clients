import Path from 'node:path'

import type { EmptyObject } from '@xylabs/object'
import type {
  Argv, CommandBuilder, CommandModule,
} from 'yargs'

import { printError, printLine } from '../../../lib/index.js'
import type { BaseArguments } from '../../BaseArguments.js'
import { opts } from '../../requireDirectoryOptions.js'
import { getNode } from '../../util/index.js'

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = (yargs: Argv) => yargs.usage('Usage: $0 node describe [command]').commandDir(Path.parse(__filename).name, opts)
export const command = 'describe'
export const deprecated = false
export const describe = 'Describe the XYO Node'
export const handler = async (argv: BaseArguments) => {
  const { verbose } = argv
  try {
    const node = await getNode(argv)
    const result = await node.state()
    printLine(JSON.stringify(result))
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

export default mod
