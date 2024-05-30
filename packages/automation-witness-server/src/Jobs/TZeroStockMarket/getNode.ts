import { assertEx } from '@xylabs/assert'
import { ApiCallWitness } from '@xyo-network/api-call-witness'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { TZeroApiCallJsonResultToSnapshotDiviner } from '@xyo-network/tzero-stock-market-plugin'

import { getWallet, WalletPaths } from '../../Account'
import tZeroMarketSnapshotDiviner from './ApiCallWitnessManifest.json'

let node: MemoryNode | undefined

export const getNode = async (): Promise<MemoryNode> => {
  if (node) return node
  const apiKey = assertEx(process.env.TZERO_MARKETDATA_API_KEY, () => 'TZERO_MARKETDATA_API_KEY is not set')
  const wallet = await getWallet(WalletPaths.TZero.Node)
  const locator = new ModuleFactoryLocator()
  locator.register(new ModuleFactory(ApiCallWitness, { headers: { 'x-apikey': apiKey } }))
  locator.register(TZeroApiCallJsonResultToSnapshotDiviner)
  const manifest = new ManifestWrapper(tZeroMarketSnapshotDiviner as PackageManifestPayload, wallet, locator)
  node = await manifest.loadNodeFromIndex(0)
  return node
}
