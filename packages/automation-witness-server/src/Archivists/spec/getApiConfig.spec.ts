import {
  describe, expect, it,
} from 'vitest'

import { getStorageArchivistApiConfig } from '../getApiConfig.ts'

describe('getApiConfig', () => {
  it('returns the API config from the ENV', () => {
    const config = getStorageArchivistApiConfig()
    expect(config).toBeTruthy()
    expect(config.apiDomain).toBeDefined()
  })
  it('returns the API config for beta if no ENV', () => {
    delete process.env.ARCHIVIST_API_DOMAIN
    const config = getStorageArchivistApiConfig()
    expect(config).toBeTruthy()
    expect(config.apiDomain).toBeDefined()
  })
})
