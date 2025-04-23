import {
  CoingeckoCryptoMarketWitness,
  CoingeckoCryptoMarketWitnessConfigSchema,
  defaultCoins,
  defaultCurrencies,
} from '@xyo-network/coingecko-crypto-market-plugin'
import { UniswapV4CryptoMarketWitnessConfigSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { UniswapV4CryptoMarketWitness, UniswapV4DefaultPools } from '@xyo-network/uniswap-v4-crypto-market-plugin'
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
    await UniswapV4CryptoMarketWitness.create({
      account: await getAccount(WalletPaths.CryptoMarket.Witness.Uniswap),
      config: {
        poolKeys: Object.values(UniswapV4DefaultPools),
        schema: UniswapV4CryptoMarketWitnessConfigSchema,
      },
      provider,
    }),
  ]
}
