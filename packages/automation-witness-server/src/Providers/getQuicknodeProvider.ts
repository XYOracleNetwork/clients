import { assertEx } from '@xylabs/assert'
import { isDefined, isUndefined } from '@xylabs/typeof'
import type { Provider } from 'ethers'
import { JsonRpcProvider } from 'ethers'

let instance: JsonRpcProvider | undefined

export const getQuickNodeProvider = (): Provider => {
  if (instance) return instance
  const config = getQuickNodeProviderConfig()
  instance = new JsonRpcProvider(config.rpcUrl, config.network)
  return instance
}

export const canUseQuickNodeProvider = (): boolean => {
  return isDefined(process.env.QUICKNODE_RPC_URL)
}

export interface QuickNodeProviderConfig {
  network: string
  rpcUrl: string
}

export const getQuickNodeProviderConfig = (): QuickNodeProviderConfig => {
  const rpcUrl = assertEx(
    process.env.QUICKNODE_RPC_URL,
    () => 'Missing QUICKNODE_RPC_URL ENV VAR',
  )

  let network = process.env.QUICKNODE_NETWORK
  if (isUndefined(network)) network = 'homestead'

  return { network, rpcUrl }
}
