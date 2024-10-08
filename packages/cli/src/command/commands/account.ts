import Path from 'node:path'

import type {
  ArgumentsCamelCase, Argv, CommandBuilder, CommandModule,
} from 'yargs'

import { printLine } from '../../lib/index.js'
import { opts } from '../requireDirectoryOptions.js'

type Arguments = {}

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = (yargs: Argv) =>
  yargs.usage('Usage: $0 account <command> [Options]').commandDir(Path.parse(__filename).name, opts).demandCommand()
export const command = 'account <command> [Options]'
export const deprecated = false
export const describe = 'Create & manage your XYO account'
export const handler = function (argv: ArgumentsCamelCase<Arguments>) {
  printLine(JSON.stringify(command))
  printLine(JSON.stringify(argv))
}

const mod: CommandModule = {
  aliases,
  command,
  deprecated,
  describe,
  handler,
}

export default mod
