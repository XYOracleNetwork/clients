import type {
  ArgumentsCamelCase, Argv, CommandBuilder, CommandModule,
} from 'yargs'

import { printLine } from '../../../lib/index.js'

type Arguments = {}

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = (yargs: Argv) =>
  yargs
    .usage('Usage: $0 diviner divine <address> <query>')
    .positional('address', { demandOption: true, type: 'string' })
    .positional('query', { demandOption: true, type: 'string' })

export const command = 'divine <address> <query>'
export const deprecated = false
export const describe = 'Query the diviner to divine the supplied query'
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
