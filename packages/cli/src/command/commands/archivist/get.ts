import type { Hash } from '@xylabs/hex'
import type { EmptyObject } from '@xylabs/object'
import type {
  ArgumentsCamelCase, Argv, CommandBuilder, CommandModule,
} from 'yargs'

import { printError, printLine } from '../../../lib/index.js'
import type { ModuleArguments } from '../ModuleArguments.js'
import { getArchivist } from './util/index.js'

type Arguments = ModuleArguments & {
  hashes: string[]
}

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = (yargs: Argv) =>
  yargs.usage('Usage: $0 archivist get <hashes..>').positional('hashes', {
    array: true, demandOption: false, type: 'string',
  })

export const command = 'get <hashes..>'
export const deprecated = false
export const describe = 'Get payload(s) from the Archivist by hash'
export const handler = async (argv: ArgumentsCamelCase<Arguments>) => {
  const { hashes, verbose } = argv
  try {
    const archivist = await getArchivist(argv)
    const result = await archivist.get(hashes as Hash[])
    printLine(JSON.stringify(result))
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Error querying Archivist')
  }
}

const mod: CommandModule<EmptyObject, Arguments> = {
  aliases,
  command,
  deprecated,
  describe,
  handler,
}

export default mod
