import { assertEx } from '@xylabs/assert'
import { isDefined } from '@xylabs/typeof'
import type { Provider } from 'ethers'
import { InfuraProvider } from 'ethers'

import type { InfuraProviderConfig } from '../Model/index.js'

let instance: InfuraProvider | undefined

export const getInfuraProvider = (): Provider => {
  if (instance) return instance
  const config = getInfuraProviderConfig()
  instance = new InfuraProvider('homestead', ...config)
  return instance
}

export const canUseInfuraProvider = (): boolean => {
  return isDefined(process.env.INFURA_PROJECT_ID) && isDefined(process.env.INFURA_PROJECT_SECRET)
}

export const getInfuraProviderConfig = (): InfuraProviderConfig => {
  const projectId = assertEx(process.env.INFURA_PROJECT_ID, () => 'Missing INFURA_PROJECT_ID ENV VAR')
  return [projectId]
}
