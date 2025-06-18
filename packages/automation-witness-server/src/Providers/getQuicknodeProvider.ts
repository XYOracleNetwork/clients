import { assertEx } from '@xylabs/assert'
import { isDefined } from '@xylabs/typeof'
import type { Provider } from 'ethers'
import { QuickNodeProvider } from 'ethers'

let instance: QuickNodeProvider | undefined

export const getQuickNodeProvider = (): Provider => {
  if (instance) return instance
  const config = getQuickNodeProviderConfig()
  instance = new QuickNodeProvider('homestead', config)
  return instance
}

export const canUseQuickNodeProvider = (): boolean => {
  return isDefined(process.env.QUICKNODE_API_TOKEN)
}

export const getQuickNodeProviderConfig = (): string => {
  const token = assertEx(
    process.env.QUICKNODE_API_TOKEN,
    () => 'Missing QUICKNODE_API_TOKEN ENV VAR',
  )
  return token
}
