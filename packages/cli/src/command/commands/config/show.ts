import type { EmptyObject } from '@xylabs/object'
import type { ModuleConfig } from '@xyo-network/module-model'
import { ModuleConfigSchema } from '@xyo-network/module-model'
import type { CommandBuilder, CommandModule } from 'yargs'

import { readFileDeep } from '../../../lib/index.js'
import type { BaseArguments } from '../../BaseArguments.js'
import { outputContext } from '../../util/index.js'

// TODO: We don't want a single config payload
// as we're really configuring an entire node
// so we'd want an array of payloads.
/**
 * Loads the XYO config from disk
 * @returns Returns a single ModuleConfig Payload
 */
const getConfig = async (): Promise<ModuleConfig> => {
  const [config, path] = readFileDeep(['xyo-config.json', 'xyo-config.js'])
  let configObj: ModuleConfig | undefined
  if (config) {
    if (path?.endsWith('.json')) {
      configObj = JSON.parse(config) as ModuleConfig
    } else if (path?.endsWith('.cjs') || path?.endsWith('.js')) {
      configObj = (await import(path)) as ModuleConfig
    }
  }
  return configObj ?? { schema: ModuleConfigSchema }
}

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = {}
export const command = 'show'
export const deprecated = false
export const describe = 'Display the current Node config'
export const handler = async (args: BaseArguments) => {
  await outputContext(args, async (log) => {
    const config = await getConfig()
    log(config)
  })
}

export const mod: CommandModule<EmptyObject, BaseArguments> = {
  aliases,
  command,
  deprecated,
  describe,
  handler,
}

export default mod
