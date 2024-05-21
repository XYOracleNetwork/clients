import { HDWallet } from '@xyo-network/account'
import { ApiConfig } from '@xyo-network/api-models'
import { asAttachableArchivistInstance, AttachableArchivistInstance, isArchivistModule } from '@xyo-network/archivist-model'
import { HttpBridge, HttpBridgeConfigSchema } from '@xyo-network/bridge-http'

import { getApiConfig } from './getApiConfig'

const schema = HttpBridgeConfigSchema
const security = { allowAnonymous: true }

export const getArchivists = async (configs: ApiConfig[] = [getApiConfig()]): Promise<AttachableArchivistInstance[]> => {
  const archivists: AttachableArchivistInstance[] = []
  for (const config of configs) {
    const nodeUrl = `${config.apiDomain}/node`
    const bridge = await HttpBridge.create({ account: await HDWallet.random(), config: { nodeUrl, schema, security } })
    await bridge.start()
    const module = await bridge.resolve('XYOPublic:Archivist')
    const mod = asAttachableArchivistInstance(module, 'Error resolving Archivist')
    if (isArchivistModule(mod)) {
      archivists.push(mod)
    }
  }
  return archivists
}
