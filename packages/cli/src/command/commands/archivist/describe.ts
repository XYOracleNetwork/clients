import type { EmptyObject } from '@xylabs/object'
import type {
  Argv, CommandBuilder, CommandModule,
} from 'yargs'

import { printError, printLine } from '../../../lib/index.js'
import type { ModuleArguments } from '../ModuleArguments.js'
import { getArchivist } from './util/index.js'

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = (yargs: Argv) => yargs.usage('Usage: $0 archivist describe')
export const command = 'describe'
export const deprecated = false
export const describe = 'Describe the XYO Archivist Module'
export const handler = async (argv: ModuleArguments) => {
  const { verbose } = argv
  try {
    const mod = await getArchivist(argv)
    const result = await mod.state()
    printLine(JSON.stringify(result))
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Error Querying Archivist')
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
