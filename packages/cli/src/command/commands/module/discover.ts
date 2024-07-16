import { EmptyObject } from '@xylabs/object'
import { Argv, CommandBuilder, CommandModule } from 'yargs'

import { printError, printLine } from '../../../lib/index.js'
import { ModuleArguments } from '../ModuleArguments.js'
import { getModuleFromArgs } from '../util/index.js'

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = (yargs: Argv) =>
  yargs.usage('Usage: $0 module discover <address>').positional('address', { demandOption: true, type: 'string' })
export const command = 'discover <address>'
export const deprecated = false
export const describe = 'Issue a Discover query against the XYO Module'
export const handler = async (argv: ModuleArguments) => {
  const { verbose } = argv
  try {
    const mod = await getModuleFromArgs(argv)
    const result = await mod.state()
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

// eslint-disable-next-line import/no-default-export
export default mod
