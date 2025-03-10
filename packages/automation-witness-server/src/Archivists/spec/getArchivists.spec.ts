import {
  describe, expect, it,
} from 'vitest'

import { getArchivists } from '../getArchivists.js'

describe('getArchivists', () => {
  it('returns the default archivists specified by the ENV if no configs supplied', async () => {
    const archivists = await getArchivists()
    expect(archivists).toBeTruthy()
    expect(Array.isArray(archivists)).toBeTruthy()
    expect(archivists.length).toBeGreaterThan(0)
  })
})
