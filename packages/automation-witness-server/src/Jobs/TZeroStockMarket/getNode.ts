import { assertEx } from '@xylabs/assert'
import type { ApiCallWitnessParams } from '@xyo-network/api-call-witness'
import { ApiCallWitness } from '@xyo-network/api-call-witness'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import type { MemoryNode } from '@xyo-network/node-memory'
import { TZeroApiCallJsonResultToSnapshotDiviner } from '@xyo-network/tzero-stock-market-plugin'

import { getWallet, WalletPaths } from '../../Account/index.ts'
import { getArchivists } from '../../Archivists/index.ts'
import tZeroMarketSnapshotDiviner from './ApiCallWitnessManifest.json' with { type: 'json' }

export const getNode = async (): Promise<MemoryNode> => {
  const apiKey = assertEx(process.env.TZERO_MARKETDATA_API_KEY, () => 'TZERO_MARKETDATA_API_KEY is not set')
  const wallet = await getWallet(WalletPaths.TZero.Node)
  const locator = new ModuleFactoryLocator()
  locator.register(new ModuleFactory(ApiCallWitness, { config: {}, headers: { 'x-apikey': apiKey } } as ApiCallWitnessParams))
  locator.register(TZeroApiCallJsonResultToSnapshotDiviner.factory())
  const manifest = new ManifestWrapper(tZeroMarketSnapshotDiviner as PackageManifestPayload, wallet, locator)
  const node = await manifest.loadNodeFromIndex(0)
  // Attach archivist to node to allow for dynamic archiving of
  // sentinel reports based on environment. The Archivist is
  // already declared in the manifest but doesn't exist as we
  // dynamically bridge to it based on the environment.
  const archivists = await getArchivists()
  for (const archivist of archivists) {
    await node.register(archivist)
    await node.attach(archivist.address, false)
  }
  return node
}
