import type { Provider } from 'ethers'
import { getDefaultProvider } from 'ethers'

import type { ProviderOptions } from '../Model/index.ts'
import { canUseAlchemyProvider, getAlchemyProviderConfig } from './getAlchemyProvider.ts'
import { canUseEtherscanProvider, getEtherscanProviderConfig } from './getEtherscanProvider.ts'
import { canUseInfuraProvider, getInfuraProviderConfig } from './getInfuraProvider.ts'
import { canUsePocketProvider, getPocketProviderConfig } from './getPocketProvider.ts'
import { canUseQuickNodeProvider, getQuickNodeProviderConfig } from './getQuicknodeProvider.ts'
import { providerOmitted } from './ProviderOmitted.ts'

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
  const quicknode = canUseQuickNodeProvider() ? getQuickNodeProviderConfig() : providerOmitted
  return {
    alchemy, etherscan, infura, pocket, quicknode,
  }
}

export const hasNonDefaultProvider = (): boolean => {
  return canUseAlchemyProvider() || canUseEtherscanProvider() || canUseInfuraProvider() || canUsePocketProvider()
}
