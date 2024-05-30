import { assertEx } from '@xylabs/assert'
import { getDefaultLogger } from '@xylabs/sdk-api-express-ecs'
import { HDWallet } from '@xyo-network/account'
import { ApiCallWitness } from '@xyo-network/api-call-witness'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { Job } from '@xyo-network/shared'
import { TZeroApiCallJsonResultToSnapshotDiviner } from '@xyo-network/tzero-stock-market-plugin'

import tZeroMarketSnapshotDiviner from './ApiCallWitnessManifest.json'

export const getTask = (): Job['task'] => {
  const logger = getDefaultLogger()
  const apiKey = assertEx(process.env.TZERO_MARKETDATA_API_KEY, () => 'TZERO_MARKETDATA_API_KEY is not set')
  const task: Job['task'] = async () => {
    try {
      logger.log('Reporting TZero Stock Prices')
      await Promise.resolve()
      const wallet = await HDWallet.random()
      const locator = new ModuleFactoryLocator()
      locator.register(new ModuleFactory(ApiCallWitness, { headers: { 'x-apikey': apiKey } }))
      locator.register(TZeroApiCallJsonResultToSnapshotDiviner)
      const manifest = new ManifestWrapper(tZeroMarketSnapshotDiviner as PackageManifestPayload, wallet, locator)
      const node = await manifest.loadNodeFromIndex(0)
      const sentinelInstance = asSentinelInstance(await node.resolve('ApiCallSentinel'))
      const sentinel = assertEx(sentinelInstance)
      await sentinel.report()
      logger.log('Reported TZero Stock Prices')
    } catch (error) {
      logger.error(error)
    }
  }
  return task
}
