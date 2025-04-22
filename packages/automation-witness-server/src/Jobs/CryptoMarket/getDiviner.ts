import { CryptoMarketAssetDiviner, CryptoMarketAssetDivinerConfigSchema } from '@xyo-network/crypto-asset-plugin'
import type { DivinerInstance } from '@xyo-network/diviner-model'

import { getAccount, WalletPaths } from '../../Account/index.ts'

export const getDiviner = async (): Promise<DivinerInstance> => {
  return await CryptoMarketAssetDiviner.create({
    account: await getAccount(WalletPaths.CryptoMarket.Diviner.Asset),
    config: { schema: CryptoMarketAssetDivinerConfigSchema },
  })
}
