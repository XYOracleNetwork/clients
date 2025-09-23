import type { AttachableModuleInstance } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import type { Payload } from '@xyo-network/payload-model'
import { MemorySentinel } from '@xyo-network/sentinel-memory'
import type { SentinelConfig } from '@xyo-network/sentinel-model'
import { SentinelConfigSchema } from '@xyo-network/sentinel-model'

import { getAccount, WalletPaths } from '../../Account/index.ts'
import { getBridge, getBridgedArchivist } from '../../Archivists/index.ts'
import { getProvider } from '../../Providers/index.ts'
import { getCryptoMarketWitness } from '../../Witnesses/index.ts'

export const reportCryptoPrices = async (provider = getProvider()): Promise<Payload[]> => {
  // Create a memory node to attach modules to
  const node = await MemoryNode.create({ account: 'random' })

  // Get the bridge
  const bridge = await getBridge()

  // Get the witnesses
  const witnesses = await getCryptoMarketWitness(provider)

  // Get the sentinel
  const archivists = await getBridgedArchivist(bridge)
  const account = await getAccount(WalletPaths.CryptoMarket.Sentinel.Market)
  const config: SentinelConfig = {
    archiving: { archivists: archivists.map(mod => mod.address) },
    schema: SentinelConfigSchema,
    synchronous: true,
    tasks: witnesses.map(mod => ({ mod: mod.address })),
  }
  const sentinel = await MemorySentinel.create({ account, config })

  // Register and attach all modules to the node
  const modules: AttachableModuleInstance[] = [bridge, ...witnesses, sentinel]
  await Promise.all(
    modules.map(async (mod) => {
      await node.register(mod)
      await node.attach(mod.address)
    }),
  )

  // Report
  const report = await sentinel.report()
  return report
}
