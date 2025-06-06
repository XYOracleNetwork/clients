import { assertEx } from '@xylabs/assert'
import { getDefaultLogger } from '@xylabs/express'
import { EthereumGasSchema } from '@xyo-network/gas-price-payload-plugin'
import type { Job } from '@xyo-network/shared'

import { getDiviner } from './getDiviner.ts'
import { reportDivinerResult } from './reportDivinerResult.ts'
import { reportGasPrices } from './reportGasPrices.ts'

export const getTask = (): Job['task'] => {
  const logger = getDefaultLogger()
  const task: Job['task'] = async () => {
    try {
      logger.log('Reporting Ethereum Gas Prices')
      const payloads = await reportGasPrices()
      logger.log('Reported Ethereum Gas Prices')
      logger.log('Divining Aggregated Gas Price')
      const diviner = await getDiviner()
      const results = await diviner.divine(payloads)
      const result = results.find(p => p.schema === EthereumGasSchema)
      const answer = assertEx(result, () => 'Empty EthereumGasPayload response from diviner')
      logger.log('Divined Aggregated Gas Price')
      logger.log('Reporting Aggregated Gas Price')
      await reportDivinerResult(answer)
      logger.log('Reported Aggregated Gas Price')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
