import {
  CoingeckoCryptoMarketWitness,
  CoingeckoCryptoMarketWitnessConfigSchema,
  defaultCoins,
  defaultCurrencies,
} from '@xyo-network/coingecko-crypto-market-plugin'
import { UniswapCryptoMarketWitnessConfigSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { UniswapCryptoMarketWitness, UniswapPoolContracts } from '@xyo-network/uniswap-crypto-market-plugin'
import { AttachableWitnessInstance } from '@xyo-network/witness-model'
import { Provider } from 'ethers'

import { getAccount, WalletPaths } from '../Account'
import { getProvider } from '../Providers'
import { WitnessProvider } from './WitnessProvider'

export const getCryptoMarketWitness: WitnessProvider<Provider> = async (provider = getProvider()): Promise<AttachableWitnessInstance[]> => {
  const witnesses: AttachableWitnessInstance[] = [
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
  return witnesses
}
