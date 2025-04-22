import { assertEx } from '@xylabs/assert'
import type { ApiConfig } from '@xyo-network/api-models'
import type { AttachableArchivistInstance } from '@xyo-network/archivist-model'
import { isAttachableArchivistInstance } from '@xyo-network/archivist-model'
import { HttpBridge, HttpBridgeConfigSchema } from '@xyo-network/bridge-http'

import {
  getApiConfigs, getChainSubmissionsArchivistApiConfig, getStorageArchivistApiConfig,
} from './getApiConfig.ts'

const archivistName = 'XYOPublic:Archivist' // TODO: This should be configurable
const discoverRoots = 'start'
const schema = HttpBridgeConfigSchema
const security = { allowAnonymous: true }

export const getArchivist = async (config: ApiConfig): Promise<AttachableArchivistInstance> => {
  return assertEx(await tryGetArchivist(config), () => 'Archivist not found')
}

export const getStorageArchivist = async (): Promise<AttachableArchivistInstance> => {
  return assertEx(await tryGetArchivist(getStorageArchivistApiConfig()), () => 'Storage Archivist not found')
}

export const getChainSubmissionsArchivist = async (): Promise<AttachableArchivistInstance> => {
  return assertEx(await tryGetArchivist(getChainSubmissionsArchivistApiConfig()), () => 'Chain Submissions Archivist not found')
}

export const tryGetArchivist = async (config: ApiConfig): Promise<AttachableArchivistInstance | undefined> => {
  const url = config.root ? `${config.apiDomain}/${config.root}` : config.apiDomain
  const bridge = await HttpBridge.create({
    account: 'random',
    config: {
      client: { discoverRoots, url }, schema, security,
    },
  })
  await bridge.start()
  const mod = await bridge.resolve(archivistName)
  return isAttachableArchivistInstance(mod) ? mod : undefined
}

export const tryGetArchivists = async (configs: ApiConfig[] = getApiConfigs()): Promise<AttachableArchivistInstance[]> => {
  const archivists: AttachableArchivistInstance[] = []
  for (const config of configs) {
    const archivist = await tryGetArchivist(config)
    if (archivist) archivists.push(archivist)
  }
  return archivists
}

export const getArchivists = async (configs: ApiConfig[] = getApiConfigs()): Promise<AttachableArchivistInstance[]> => {
  const archivists: AttachableArchivistInstance[] = []
  for (const config of configs) {
    archivists.push(await getArchivist(config))
  }
  return archivists
}
