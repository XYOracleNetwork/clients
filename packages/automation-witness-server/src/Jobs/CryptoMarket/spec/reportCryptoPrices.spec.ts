import {
  describe, expect, it,
} from 'vitest'

import { hasNonDefaultProvider } from '../../../Providers/index.js'
import { reportCryptoPrices } from '../reportCryptoPrices.js'

/**
 * @group crypto
 * @group slow
 */

describe.runIf(hasNonDefaultProvider())('reportCryptoPrices', () => {
  it('gets prices using default provider if no provider supplied', async () => {
    const [bw, ...payloads] = await reportCryptoPrices()
    expect(bw).toBeTruthy()
    expect(payloads.length).toBeGreaterThan(0)
  }, 60_000)
})
