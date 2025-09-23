import { MemoryNode } from '@xyo-network/node-memory'
import type { Payload } from '@xyo-network/payload-model'
import { MemorySentinel } from '@xyo-network/sentinel-memory'
import type { SentinelConfig } from '@xyo-network/sentinel-model'
import { SentinelConfigSchema } from '@xyo-network/sentinel-model'
import { HDWallet } from '@xyo-network/wallet'
import { AdhocWitness, AdhocWitnessConfigSchema } from '@xyo-network/witness-adhoc'

import { getAccount, WalletPaths } from '../../Account/index.ts'
import { getBridge, getBridgedArchivist } from '../../Archivists/index.ts'

export const reportDivinerResult = async (payload: Payload): Promise<Payload[]> => {
  // Create a memory node to attach modules to
  const node = await MemoryNode.create({ account: await HDWallet.random() })

  // Get the bridge
  const bridge = await getBridge()

  // Get the witnesses
  const adHocWitnessAccount = await getAccount(WalletPaths.CryptoMarket.AdHocWitness.AssetDivinerResult)
  const witnesses = [await AdhocWitness.create({ account: adHocWitnessAccount, config: { payload, schema: AdhocWitnessConfigSchema } })]

  // Get the sentinel
  const archivists = await getBridgedArchivist(bridge)
  const config: SentinelConfig = {
    archiving: { archivists: archivists.map(mod => mod.address) },
    schema: SentinelConfigSchema,
    synchronous: true,
    tasks: witnesses.map(mod => ({ mod: mod.address })),
  }
  const sentinelAccount = await getAccount(WalletPaths.CryptoMarket.Sentinel.AssetDivinerResult)
  const sentinel = await MemorySentinel.create({ account: sentinelAccount, config })

  // Register and attach all modules to the node
  const modules = [bridge, ...witnesses, sentinel]
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
