import { isDefined } from '@xylabs/typeof'
import { HttpBridge, HttpBridgeConfigSchema } from '@xyo-network/bridge-http'
import type { AttachableModuleInstance } from '@xyo-network/module-model'

import type { ApiModuleConfig } from './getApiModuleConfig.ts'
import { getStorageArchivistApiModuleConfig } from './getApiModuleConfig.ts'

const discoverRoots = 'start'
const schema = HttpBridgeConfigSchema
const security = { allowAnonymous: true }

export const getBridge = async (config: ApiModuleConfig = getStorageArchivistApiModuleConfig()): Promise<AttachableModuleInstance> => {
  const url = isDefined(config.root) ? `${config.apiDomain}/${config.root}` : config.apiDomain
  const bridge = await HttpBridge.create({
    account: 'random',
    config: {
      discoverRoots, name: 'TestBridge', nodeUrl: url, schema, security,
    },
  })
  await bridge.start()
  return bridge
}
