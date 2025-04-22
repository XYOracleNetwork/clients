import type { ApiConfig } from '@xyo-network/api-models'
import type { ModuleIdentifier } from '@xyo-network/module-model'

export type ApiModuleConfig = ApiConfig & {
  id: ModuleIdentifier
}

export const getStorageArchivistApiModuleConfig = (): ApiModuleConfig => {
  return {
    apiDomain: process.env.ARCHIVIST_API_DOMAIN || 'https://beta.api.archivist.xyo.network',
    id: 'XYOPublic:Archivist',
  }
}

export const getApiConfigs = (): ApiModuleConfig[] => {
  return [
    getStorageArchivistApiModuleConfig(),
  ]
}
