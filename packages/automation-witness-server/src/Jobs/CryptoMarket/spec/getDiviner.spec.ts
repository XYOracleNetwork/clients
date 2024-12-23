import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { getDiviner } from '../getDiviner.js'

describe('getCryptoMarketAssetDiviner', () => {
  it('gets the getCryptoMarketAssetDiviner', async () => {
    const diviner = await getDiviner()
    expect(diviner).toBeObject()
    expect(diviner.query).toBeFunction()
  })
})
