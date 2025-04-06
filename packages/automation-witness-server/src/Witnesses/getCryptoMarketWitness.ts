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

import { getAccount, WalletPaths } from '../Account/index.js'
import { getProvider } from '../Providers/index.js'
import type { WitnessProvider } from './WitnessProvider.js'

let witnesses: AttachableWitnessInstance[] | undefined

const useUniswapWitness = false

export const getCryptoMarketWitness: WitnessProvider<Provider> = async (provider = getProvider()): Promise<AttachableWitnessInstance[]> => {
  if (witnesses) return witnesses
  else {
    const coingeckoWitness = await CoingeckoCryptoMarketWitness.create({
      account: await getAccount(WalletPaths.CryptoMarket.Witness.Coingecko),
      config: {
        coins: defaultCoins,
        currencies: defaultCurrencies,
        schema: CoingeckoCryptoMarketWitnessConfigSchema,
      },
    })
    const uniswapWitness = await UniswapCryptoMarketWitness.create({
        account: await getAccount(WalletPaths.CryptoMarket.Witness.Uniswap),
        config: {
          pools: UniswapPoolContracts,
          schema: UniswapCryptoMarketWitnessConfigSchema,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provider: provider as any,
      }),
      witnesses = useUniswapWitness ? [coingeckoWitness, uniswapWitness] : [coingeckoWitness]
    return witnesses
  }
}
