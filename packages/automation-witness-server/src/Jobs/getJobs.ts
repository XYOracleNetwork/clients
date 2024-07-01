import { Job } from '@xyo-network/shared'

import { getJob as getCryptoMarketWitnessJob } from './CryptoMarket'
import { getJob as getEthereumGasJob } from './EthereumGas'
import { getJob as getTZeroStockPriceJob } from './TZeroStockMarket'
import { getJob as getMediumRssJob } from './XyoMediumRss'

export const getJobs = (): Job[] => {
  return [getCryptoMarketWitnessJob(), getEthereumGasJob(), getTZeroStockPriceJob(), getMediumRssJob()]
}
