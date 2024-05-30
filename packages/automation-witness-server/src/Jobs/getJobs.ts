import { Job } from '@xyo-network/shared'

import { getJob as getCryptoMarketWitnessJob } from './CryptoMarket'
import { getJob as getEthereumGasJob } from './EthereumGas'
import { getJob as getTZeroStockPriceJob } from './TZeroStockMarket'

export const getJobs = (): Job[] => {
  return [getCryptoMarketWitnessJob(), getEthereumGasJob(), getTZeroStockPriceJob()]
}
