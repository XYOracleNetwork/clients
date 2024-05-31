import { AccountInstance } from '@xyo-network/account'

import { getWallet } from './getWallet'

export const getAccount = async (path?: string): Promise<AccountInstance> => {
  return await getWallet(path)
}
