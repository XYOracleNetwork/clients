import { assertEx } from '@xylabs/assert'
import { HDWallet } from '@xyo-network/account'
import { ApiConfig } from '@xyo-network/api-models'
import { AttachableArchivistInstance, isAttachableArchivistInstance } from '@xyo-network/archivist-model'
import { HttpBridge, HttpBridgeConfigSchema } from '@xyo-network/bridge-http'

import { getApiConfig } from './getApiConfig'

const discoverRoots = 'start'
const schema = HttpBridgeConfigSchema
const security = { allowAnonymous: true }

export const getArchivist = async (config: ApiConfig = getApiConfig()): Promise<AttachableArchivistInstance> => {
  return assertEx(await tryGetArchivist(config), () => 'Archivist not found')
}

export const tryGetArchivist = async (config: ApiConfig = getApiConfig()): Promise<AttachableArchivistInstance | undefined> => {
  const url = `${config.apiDomain}`
  const account = await HDWallet.random()
  const bridge = await HttpBridge.create({ account, config: { client: { discoverRoots, url }, schema, security } })
  await bridge.start()
  const module = await bridge.resolve('XYOPublic:Archivist')
  return isAttachableArchivistInstance(module) ? module : undefined
}

export const tryGetArchivists = async (configs: ApiConfig[] = [getApiConfig()]): Promise<AttachableArchivistInstance[]> => {
  const archivists: AttachableArchivistInstance[] = []
  for (const config of configs) {
    const archivist = await tryGetArchivist(config)
    if (archivist) archivists.push(archivist)
  }
  return archivists
}

export const getArchivists = async (configs: ApiConfig[] = [getApiConfig()]): Promise<AttachableArchivistInstance[]> => {
  const archivists: AttachableArchivistInstance[] = []
  for (const config of configs) {
    archivists.push(await getArchivist(config))
  }
  return archivists
}
