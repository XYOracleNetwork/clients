import { AttachableModuleInstance } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { Payload } from '@xyo-network/payload-model'
import { MemorySentinel, SentinelConfig, SentinelConfigSchema } from '@xyo-network/sentinel'

import { getAccount, WalletPaths } from '../../Account'
import { getArchivists } from '../../Archivists'

export const reportStockPrices = async (): Promise<Payload[]> => {
  const archivists = await getArchivists()
  const modules: AttachableModuleInstance[] = [...archivists]
  const node = await MemoryNode.create()
  await Promise.all(
    modules.map(async (mod) => {
      await node.register(mod)
      await node.attach(mod.address, true)
    }),
  )
  const config: SentinelConfig = {
    archiving: {
      archivists: archivists.map((mod) => mod.address),
    },
    schema: SentinelConfigSchema,
    synchronous: true,
    // TODO: How to create new sentinel or add archivists to existing sentinel from manifest
    // tasks: witnesses.map((mod) => ({ module: mod.address })),
    tasks: [],
  }
  const account = await getAccount(WalletPaths.CryptoMarket.Sentinel.Market)
  const sentinel = await MemorySentinel.create({ account, config })
  await node.register(sentinel)
  await node.attach(account.address, true)
  const report = await sentinel.report()
  return report
}