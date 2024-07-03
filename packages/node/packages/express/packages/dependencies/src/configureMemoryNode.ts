import { readFile } from 'node:fs/promises'

import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import { Hash } from '@xylabs/hex'
import { AccountInstance, HDWallet } from '@xyo-network/account'
import { ArchivistInsertQuerySchema, isArchivistInstance, withArchivistInstance } from '@xyo-network/archivist-model'
import { ManifestWrapper, ModuleManifest, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleConfig } from '@xyo-network/module-model'
import { TYPES } from '@xyo-network/node-core-types'
import { NodeInstance } from '@xyo-network/node-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Container } from 'inversify'

import { defaultNode, nftContractNode, nftMetadataNode } from './Manifest'
import { witnessNftCollections } from './witnessNftCollections'

// TODO: How to inject account for node that is to be created from config?
export const configureMemoryNode = async (container: Container, _memoryNode?: NodeInstance, _account?: AccountInstance) => {
  const node = await loadNodeFromConfig(container)
  // const node: NodeInstance = memoryNode ?? (await MemoryNode.create({ account, config }))
  container.bind<NodeInstance>(TYPES.Node).toConstantValue(node)
  const configHashes = process.env.CONFIG_HASHES
  if (configHashes) {
    const hashes = configHashes.split(',').filter(exists) as Hash[]
    if (hashes.length > 0) {
      const configPayloads: Record<string, ModuleConfig> = {}
      const mods = await node.resolve({ query: [[ArchivistInsertQuerySchema]] }, { direction: 'down', identity: isArchivistInstance })
      for (const mod of mods) {
        await withArchivistInstance(mod, async (archivist) => {
          const payloads = await archivist.get(hashes)
          await Promise.all(
            payloads.map(async (payload) => {
              configPayloads[await PayloadBuilder.dataHash(assertEx(payload, () => 'Received null payload'))] = payload as ModuleConfig
            }),
          )
        })
      }
      // TODO: Register additional modules specified by hashes
    }
  }
  if (process.env.WITNESS_NFT_COLLECTIONS) {
    await witnessNftCollections(node)
  }
  const modules = await node.resolve('*', { direction: 'down', maxDepth: 10 })
  for (const mod of modules) {
    console.log(`Expose: ${mod.address} [${mod.id}]`)
  }
}

const loadNodeFromConfig = async (container: Container, config?: string) => {
  const manifest: PackageManifestPayload =
    config ? (JSON.parse(await readFile(config, 'utf8')) as PackageManifestPayload) : (defaultNode as PackageManifestPayload)
  // TODO: Import all public children from manifest once we're OK to move the image thumbnail
  // modules from the main node to a child node
  const manifestPublicChildren: ModuleManifest[] = config ? [] : [...nftContractNode.nodes, ...nftMetadataNode.nodes]
  const mnemonic = container.get<string>(TYPES.AccountMnemonic)
  const wallet = await HDWallet.fromPhrase(mnemonic)
  const locator = container.get<ModuleFactoryLocator>(TYPES.ModuleFactoryLocator)
  const wrapper = new ManifestWrapper(manifest, wallet, locator, manifestPublicChildren)
  const [parentNode, ...childNodes] = await wrapper.loadNodes()
  if (childNodes?.length) {
    await Promise.all(childNodes.map((childNode) => parentNode.register(childNode)))
    await Promise.all(childNodes.map((childNode) => parentNode.attach(childNode.address, true)))
  }
  return parentNode
}
