import type { Provider } from 'ethers'
import { getDefaultProvider } from 'ethers'

import type { ProviderOptions } from '../Model/index.js'
import { canUseAlchemyProvider, getAlchemyProviderConfig } from './getAlchemyProvider.js'
import { canUseEtherscanProvider, getEtherscanProviderConfig } from './getEtherscanProvider.js'
import { canUseInfuraProvider, getInfuraProviderConfig } from './getInfuraProvider.js'
import { canUsePocketProvider, getPocketProviderConfig } from './getPocketProvider.js'
import { providerOmitted } from './ProviderOmitted.js'

let instance: Provider | undefined

export const getProvider = (): Provider => {
  if (instance) return instance
  instance = getDefaultProvider('homestead', getProviderOptions())
  return instance
}

const getProviderOptions = (): ProviderOptions => {
  const alchemy = canUseAlchemyProvider() ? getAlchemyProviderConfig() : providerOmitted
  const etherscan = canUseEtherscanProvider() ? getEtherscanProviderConfig() : providerOmitted
  const infura = canUseInfuraProvider() ? getInfuraProviderConfig() : providerOmitted
  const pocket = canUsePocketProvider() ? getPocketProviderConfig() : providerOmitted
  return {
    alchemy, etherscan, infura, pocket,
  }
}

export const hasNonDefaultProvider = (): boolean => {
  return canUseAlchemyProvider() || canUseEtherscanProvider() || canUseInfuraProvider() || canUsePocketProvider()
}
