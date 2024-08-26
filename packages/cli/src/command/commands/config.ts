import Path from 'node:path'

import type {
  ArgumentsCamelCase, Argv, CommandBuilder, CommandModule,
} from 'yargs'

import { printLine } from '../../lib/index.js'
import { opts } from '../requireDirectoryOptions.js'

type Arguments = {}

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = (yargs: Argv) =>
  yargs.usage('Usage: $0 config <command> [Options]').commandDir(Path.parse(__filename).name, opts).demandCommand()
export const command = 'config <command> [Options]'
export const deprecated = false
export const describe = 'Get and set CLI/Node config options'
export const handler = (argv: ArgumentsCamelCase<Arguments>) => {
  printLine(JSON.stringify(command))
  printLine(JSON.stringify(argv))
}

export const mod: CommandModule = {
  aliases,
  command,
  deprecated,
  describe,
  handler,
}

export default mod
