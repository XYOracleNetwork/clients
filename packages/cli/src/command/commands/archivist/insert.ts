import { EmptyObject } from '@xylabs/object'
import { ArgumentsCamelCase, Argv, CommandBuilder, CommandModule } from 'yargs'

import { printLine } from '../../../lib'
import { ModuleArguments } from '../ModuleArguments'

type Arguments = ModuleArguments & {
  payloads: string[]
}

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = (yargs: Argv) =>
  yargs.usage('Usage: $0 archivist insert <payloads..>').positional('payloads', { array: true, demandOption: true, type: 'string' })

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

// eslint-disable-next-line import/no-default-export
export default mod
