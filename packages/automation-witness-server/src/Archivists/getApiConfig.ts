import type { ApiConfig } from '@xyo-network/api-models'

export const getStorageArchivistApiConfig = (): ApiConfig => {
  return { apiDomain: process.env.ARCHIVIST_API_DOMAIN || 'https://beta.api.archivist.xyo.network' }
}

export const getChainArchivistApiConfig = (): ApiConfig => {
  return { apiDomain: process.env.CHAIN_SUBMISSIONS_ARCHIVIST_API_DOMAIN || 'https://beta.api.chain.xyo.network/' }
}

export const getApiConfigs = (): ApiConfig[] => {
  return [
    getStorageArchivistApiConfig(),
    getChainArchivistApiConfig(),
  ]
}
