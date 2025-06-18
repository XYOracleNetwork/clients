import { assertEx } from '@xylabs/assert'
import { isDefined } from '@xylabs/typeof'
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
  return isDefined(process.env.POCKET_PORTAL_ID) && isDefined(process.env.POCKET_SECRET_KEY)
}

export const getPocketProviderConfig = (): PocketProviderConfig => {
  const applicationId = assertEx(process.env.POCKET_PORTAL_ID, () => 'Missing POCKET_PORTAL_ID ENV VAR')
  const applicationSecretKey = assertEx(process.env.POCKET_SECRET_KEY, () => 'Missing POCKET_SECRET_KEY ENV VAR')
  return [applicationId, applicationSecretKey]
}
