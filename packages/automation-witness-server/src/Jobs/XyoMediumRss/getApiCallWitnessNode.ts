import { ApiCallWitness } from '@xyo-network/api-call-witness'
import { JsonPathDiviner } from '@xyo-network/diviner-jsonpath-memory'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { MemoryNode } from '@xyo-network/node-memory'
import { XmlParsingDiviner } from '@xyo-network/xml-plugin'

import { getWallet, WalletPaths } from '../../Account'
import { getArchivist } from '../../Archivists'
import apiCallWitnessManifestPayload from './ApiCallWitnessManifest.json'

export const getApiCallWitnessNode = async (): Promise<MemoryNode> => {
  const wallet = await getWallet(WalletPaths.MediumRss.Node)
  const locator = new ModuleFactoryLocator()
  locator.register(ApiCallWitness)
  locator.register(XmlParsingDiviner)
  locator.register(JsonPathDiviner)
  const manifest = new ManifestWrapper(apiCallWitnessManifestPayload as PackageManifestPayload, wallet, locator)
  const node = await manifest.loadNodeFromIndex(0)
  // Attach archivist to node to allow for dynamic archiving of
  // sentinel reports based on environment. The Archivist is
  // already declared in the manifest but doesn't exist as we
  // dynamically bridge to it based on the environment.
  const archivist = await getArchivist()
  await node.register(archivist)
  await node.attach(archivist.address, true)
  return node
}
