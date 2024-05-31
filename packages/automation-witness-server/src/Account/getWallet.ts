import { assertEx } from '@xylabs/assert'
import { HDWallet, WalletInstance } from '@xyo-network/account'

export const getWallet = async (path?: string): Promise<WalletInstance> => {
  const mnemonic = assertEx(process.env.MNEMONIC, () => 'Missing mnemonic for wallet creation')
  return await HDWallet.fromPhrase(mnemonic, path)
}
