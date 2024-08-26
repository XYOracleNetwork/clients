import type { EmptyObject } from '@xylabs/object'
import type {
  ArgumentsCamelCase, Argv, CommandBuilder, CommandModule,
} from 'yargs'

import { printLine } from '../../../lib/index.js'
import type { ModuleArguments } from '../ModuleArguments.js'

type Arguments = ModuleArguments & {
  payloads: string[]
}

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = (yargs: Argv) =>
  yargs.usage('Usage: $0 archivist insert <payloads..>').positional('payloads', {
    array: true, demandOption: true, type: 'string',
  })

export const command = 'insert <payloads..>'
export const deprecated = false
export const describe = 'Insert payload(s) into the Archivist'
export const handler = (argv: ArgumentsCamelCase<Arguments>) => {
  printLine(JSON.stringify(command))
  printLine(JSON.stringify(argv))
}

const mod: CommandModule<EmptyObject, Arguments> = {
  aliases,
  command,
  deprecated,
  describe,
  handler,
}

export default mod
