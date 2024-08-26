import Path from 'node:path'

import type { EmptyObject } from '@xylabs/object'
import type {
  ArgumentsCamelCase, Argv, CommandBuilder, CommandModule,
} from 'yargs'

import { printError, printLine } from '../../lib/index.js'
import { opts } from '../requireDirectoryOptions.js'
import type { ModuleArguments } from './ModuleArguments.js'
import { getModuleFromArgs } from './util/index.js'

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = (yargs: Argv) =>
  yargs.usage('Usage: $0 module <query> <address> [Options]').commandDir(Path.parse(__filename).name, opts)
export const command = 'module <address>'
export const deprecated = false
export const describe = 'Issue queries against an XYO Module'
export const handler = async (argv: ArgumentsCamelCase<ModuleArguments>) => {
  const { verbose } = argv
  try {
    const mod = await getModuleFromArgs(argv)
    const result = mod.state() ?? {}
    printLine(JSON.stringify(result))
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Error querying for archivists')
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
