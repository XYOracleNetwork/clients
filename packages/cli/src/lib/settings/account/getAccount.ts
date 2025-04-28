import { generateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import type { AccountInstance } from '@xyo-network/account-model'
import { HDWallet } from '@xyo-network/wallet'

import { loadMnemonic } from './loadMnemonic.js'
import { saveMnemonic } from './saveMnemonic.js'

export const getAccount = async (): Promise<AccountInstance> => {
  let mnemonic = await loadMnemonic()
  if (!mnemonic) {
    mnemonic = generateMnemonic(wordlist, 256)
    await saveMnemonic(mnemonic)
  }
  const account = HDWallet.fromPhrase(mnemonic)
  return account
}
