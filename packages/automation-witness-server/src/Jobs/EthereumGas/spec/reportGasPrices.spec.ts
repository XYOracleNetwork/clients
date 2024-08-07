import { getProvider } from '../../../Providers/index.js'
import { reportGasPrices } from '../reportGasPrices.js'

/**
 * @group crypto
 * @group slow
 */

describe('reportGasPrices', () => {
  it('reports supplied provider', async () => {
    const panel = await reportGasPrices(getProvider())
    expect(panel).toBeTruthy()
  })
  it('reports using default provider if no provider supplied', async () => {
    const panel = await reportGasPrices()
    expect(panel).toBeTruthy()
  })
})
