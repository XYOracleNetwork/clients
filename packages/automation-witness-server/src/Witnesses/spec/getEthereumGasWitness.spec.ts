import { getProvider } from '../../Providers/index.js'
import { getEthereumGasWitness } from '../getEthereumGasWitness.js'

describe('getCryptoMarketWitness', () => {
  it('gets witnesses using supplied provider', async () => {
    const panel = await getEthereumGasWitness(getProvider())
    expect(panel).toBeArray()
  })
  it('gets witnesses using default provider if no provider supplied', async () => {
    const panel = await getEthereumGasWitness()
    expect(panel).toBeArray()
  })
})
