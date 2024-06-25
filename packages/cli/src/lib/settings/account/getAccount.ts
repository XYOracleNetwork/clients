import { generateMnemonic } from '@scure/bip39'

import { wordlist } from '@scure/bip39/wordlists/english'
import { HDWallet } from '@xyo-network/account'
import { AccountInstance } from '@xyo-network/account-model'

import { loadMnemonic } from './loadMnemonic'
import { saveMnemonic } from './saveMnemonic'

export const getAccount = async (): Promise<AccountInstance> => {
  let mnemonic = await loadMnemonic()
  if (!mnemonic) {
    mnemonic = generateMnemonic(wordlist, 256)
    await saveMnemonic(mnemonic)
  }
  const account = HDWallet.fromPhrase(mnemonic)
  return account
}
