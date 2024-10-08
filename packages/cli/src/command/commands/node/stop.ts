import type { EmptyObject } from '@xylabs/object'
import type {
  ArgumentsCamelCase, CommandBuilder, CommandModule,
} from 'yargs'

import { stop } from '../../../lib/index.js'
import type { BaseArguments } from '../../BaseArguments.js'
import { outputContext } from '../../util/index.js'

type Arguments = BaseArguments & {
  force?: boolean
}

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = {
  force: {
    alias: ['f'],
    boolean: true,
    default: false,
    describe: 'Forcefully attempt the operation by stopping processes on suspected app port',
    type: 'boolean',
  },
}
export const command = 'stop'
export const deprecated = false
export const describe = 'stop the local XYO Node'
export const handler = async (args: ArgumentsCamelCase<Arguments>) => {
  await outputContext(args, async () => {
    await stop()
  })
}

const mod: CommandModule<EmptyObject, Arguments> = {
  aliases,
  command,
  deprecated,
  describe,
  handler,
}

export default mod
