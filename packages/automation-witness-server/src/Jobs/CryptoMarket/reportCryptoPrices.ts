import type { AttachableModuleInstance } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import type { Payload } from '@xyo-network/payload-model'
import { MemorySentinel } from '@xyo-network/sentinel-memory'
import type { SentinelConfig } from '@xyo-network/sentinel-model'
import { SentinelConfigSchema } from '@xyo-network/sentinel-model'

import { getAccount, WalletPaths } from '../../Account/index.js'
import { getArchivists } from '../../Archivists/index.js'
import { getProvider } from '../../Providers/index.js'
import { getCryptoMarketWitness } from '../../Witnesses/index.js'

export const reportCryptoPrices = async (provider = getProvider()): Promise<Payload[]> => {
  const archivists = await getArchivists()
  const witnesses = await getCryptoMarketWitness(provider)
  const modules: AttachableModuleInstance[] = [...archivists, ...witnesses]
  const node = await MemoryNode.create()
  await Promise.all(
    modules.map(async (mod) => {
      await node.register(mod)
      await node.attach(mod.address, true)
    }),
  )
  const config: SentinelConfig = {
    archiving: { archivists: archivists.map(mod => mod.address) },
    schema: SentinelConfigSchema,
    synchronous: true,
    tasks: witnesses.map(mod => ({ mod: mod.address })),
  }
  const account = await getAccount(WalletPaths.CryptoMarket.Sentinel.Market)
  const sentinel = await MemorySentinel.create({ account, config })
  await node.register(sentinel)
  await node.attach(account.address, true)
  const report = await sentinel.report()
  return report
}
