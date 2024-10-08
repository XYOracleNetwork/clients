import type { EmptyObject } from '@xylabs/object'
import type {
  Argv, CommandBuilder, CommandModule,
} from 'yargs'

import { printError, printLine } from '../../../lib/index.js'
import type { ModuleArguments } from '../ModuleArguments.js'
import { getModuleFromArgs } from '../util/index.js'

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = (yargs: Argv) =>
  yargs.usage('Usage: $0 module describe <address>').positional('address', { demandOption: true, type: 'string' })
export const command = 'previousHash <address>'
export const deprecated = false
export const describe = 'Issue a PreviousHash Query against the XYO Module'
export const handler = async (argv: ModuleArguments) => {
  const { verbose } = argv
  try {
    const mod = await getModuleFromArgs(argv)
    const result = await mod.previousHash()
    printLine(JSON.stringify(result))
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Error Querying Module')
  }
}

const mod: CommandModule<EmptyObject, ModuleArguments> = {
  aliases,
  command,
  deprecated,
  describe,
  handler,
}

export default mod
