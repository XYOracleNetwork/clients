import type { AccountInstance } from '@xyo-network/account'

import { getWallet } from './getWallet.js'

export const getAccount = async (path?: string): Promise<AccountInstance> => {
  return await getWallet(path)
}
