import { Job } from '@xyo-network/shared'

import { getJob as getCryptoMarketWitnessJob } from './CryptoMarket/index.js'
import { getJob as getEthereumGasJob } from './EthereumGas/index.js'
import { getJob as getTZeroStockPriceJob } from './TZeroStockMarket/index.js'

export const getJobs = (): Job[] => {
  return [getCryptoMarketWitnessJob(), getEthereumGasJob(), getTZeroStockPriceJob()]
}
