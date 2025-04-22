import {
  describe, expect, it,
} from 'vitest'

import { getStorageArchivistApiModuleConfig } from '../getApiModuleConfig.ts'

describe('getApiConfig', () => {
  it('returns the API config from the ENV', () => {
    const config = getStorageArchivistApiModuleConfig()
    expect(config).toBeTruthy()
    expect(config.apiDomain).toBeDefined()
  })
  it('returns the API config for beta if no ENV', () => {
    delete process.env.ARCHIVIST_API_DOMAIN
    const config = getStorageArchivistApiModuleConfig()
    expect(config).toBeTruthy()
    expect(config.apiDomain).toBeDefined()
  })
})
