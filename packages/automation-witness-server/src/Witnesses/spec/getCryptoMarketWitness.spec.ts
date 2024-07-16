import { getProvider } from '../../Providers/index.js'
import { getCryptoMarketWitness } from '../getCryptoMarketWitness.js'

describe('getCryptoMarketWitness', () => {
  it('gets witnesses using supplied provider', async () => {
    const panel = await getCryptoMarketWitness(getProvider())
    expect(panel).toBeArray()
  })
  it('gets witnesses using default provider if no provider supplied', async () => {
    const panel = await getCryptoMarketWitness()
    expect(panel).toBeArray()
  })
})
