import { generateMnemonic } from '@scure/bip39'
// eslint-disable-next-line import/no-internal-modules
import { wordlist } from '@scure/bip39/wordlists/english'
import { HDWallet } from '@xyo-network/account'
import { AccountInstance } from '@xyo-network/account-model'

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
