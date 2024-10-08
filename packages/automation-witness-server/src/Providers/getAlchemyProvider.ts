import { assertEx } from '@xylabs/assert'
import type { Provider } from 'ethers'
import { AlchemyProvider } from 'ethers'

let instance: AlchemyProvider | undefined

export const getAlchemyProvider = (): Provider => {
  if (instance) return instance
  const apiKey = getAlchemyProviderConfig()
  instance = new AlchemyProvider('homestead', apiKey)
  return instance
}

export const canUseAlchemyProvider = (): boolean => {
  return process.env.ALCHEMY_PROJECT_KEY ? true : false
}

export const getAlchemyProviderConfig = (): string => {
  const projectKey = assertEx(process.env.ALCHEMY_PROJECT_KEY, () => 'Missing ALCHEMY_PROJECT_KEY ENV VAR')
  return projectKey
}
