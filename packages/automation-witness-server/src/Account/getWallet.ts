import { assertEx } from '@xylabs/assert'
import { HDWallet } from '@xyo-network/wallet'
import type { WalletInstance } from '@xyo-network/wallet-model'

export const getWallet = async (path?: string): Promise<WalletInstance> => {
  const mnemonic = assertEx(process.env.MNEMONIC, () => 'Missing mnemonic for wallet creation')
  return await HDWallet.fromPhrase(mnemonic, path)
}
