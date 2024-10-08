import { assertEx } from '@xylabs/assert'
import type { Provider } from 'ethers'
import { EtherscanProvider } from 'ethers'

let instance: EtherscanProvider | undefined

export const getEtherscanProvider = (): Provider => {
  if (instance) return instance
  const apiKey = getEtherscanProviderConfig()
  instance = new EtherscanProvider('homestead', apiKey)
  return instance
}

export const canUseEtherscanProvider = (): boolean => {
  return process.env.ETHERSCAN_API_KEY ? true : false
}

export const getEtherscanProviderConfig = (): string => {
  const projectKey = assertEx(process.env.ETHERSCAN_API_KEY, () => 'Missing ETHERSCAN_API_KEY ENV VAR')
  return projectKey
}
