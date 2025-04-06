import {
  CoingeckoCryptoMarketWitness,
  CoingeckoCryptoMarketWitnessConfigSchema,
  defaultCoins,
  defaultCurrencies,
} from '@xyo-network/coingecko-crypto-market-plugin'
import { UniswapCryptoMarketWitnessConfigSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { UniswapCryptoMarketWitness, UniswapPoolContracts } from '@xyo-network/uniswap-crypto-market-plugin'
import type { AttachableWitnessInstance } from '@xyo-network/witness-model'
import type { Provider } from 'ethers'

import { getAccount, WalletPaths } from '../Account/index.ts'
import { getProvider } from '../Providers/index.ts'
import type { WitnessProvider } from './WitnessProvider.ts'

export const getCryptoMarketWitness: WitnessProvider<Provider> = async (provider = getProvider()): Promise<AttachableWitnessInstance[]> => {
  return [
    await CoingeckoCryptoMarketWitness.create({
      account: await getAccount(WalletPaths.CryptoMarket.Witness.Coingecko),
      config: {
        coins: defaultCoins,
        currencies: defaultCurrencies,
        schema: CoingeckoCryptoMarketWitnessConfigSchema,
      },
    }),
    await UniswapCryptoMarketWitness.create({
      account: await getAccount(WalletPaths.CryptoMarket.Witness.Uniswap),
      config: {
        pools: UniswapPoolContracts,
        schema: UniswapCryptoMarketWitnessConfigSchema,
      },
      provider,
    }),
  ]
}
