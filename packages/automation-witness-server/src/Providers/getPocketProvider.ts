import { assertEx } from '@xylabs/assert'
import type { Provider } from 'ethers'
import { PocketProvider } from 'ethers'

import type { PocketProviderConfig } from '../Model/index.js'

let instance: PocketProvider | undefined

export const getPocketProvider = (): Provider => {
  if (instance) return instance
  const config = getPocketProviderConfig()
  instance = new PocketProvider('homestead', ...config)
  return instance
}

export const canUsePocketProvider = (): boolean => {
  return !!process.env.POCKET_PORTAL_ID && !!process.env.POCKET_SECRET_KEY ? true : false
}

export const getPocketProviderConfig = (): PocketProviderConfig => {
  const applicationId = assertEx(process.env.POCKET_PORTAL_ID, () => 'Missing POCKET_PORTAL_ID ENV VAR')
  const applicationSecretKey = assertEx(process.env.POCKET_SECRET_KEY, () => 'Missing POCKET_SECRET_KEY ENV VAR')
  return [applicationId, applicationSecretKey]
}
