import { MemoryNode } from '@xyo-network/node-memory'
import type { Payload } from '@xyo-network/payload-model'
import { MemorySentinel } from '@xyo-network/sentinel-memory'
import type { SentinelConfig } from '@xyo-network/sentinel-model'
import { SentinelConfigSchema } from '@xyo-network/sentinel-model'
import { HDWallet } from '@xyo-network/wallet'
import { AdhocWitness, AdhocWitnessConfigSchema } from '@xyo-network/witness-adhoc'

import { getAccount, WalletPaths } from '../../Account/index.ts'
import { getArchivists } from '../../Archivists/index.ts'

export const reportDivinerResult = async (payload: Payload): Promise<Payload[]> => {
  const adHocWitnessAccount = await getAccount(WalletPaths.CryptoMarket.AdHocWitness.AssetDivinerResult)
  const archivists = await getArchivists()
  const witnesses = [await AdhocWitness.create({ account: adHocWitnessAccount, config: { payload, schema: AdhocWitnessConfigSchema } })]
  const modules = [...archivists, ...witnesses]
  const node = await MemoryNode.create({ account: await HDWallet.random() })
  await Promise.all(
    modules.map(async (mod) => {
      await node.register(mod)
      await node.attach(mod.address)
    }),
  )
  const config: SentinelConfig = {
    archiving: { archivists: archivists.map(mod => mod.address) },
    schema: SentinelConfigSchema,
    synchronous: true,
    tasks: witnesses.map(mod => ({ mod: mod.address })),
  }
  const sentinelAccount = await getAccount(WalletPaths.CryptoMarket.Sentinel.AssetDivinerResult)
  const sentinel = await MemorySentinel.create({ account: sentinelAccount, config })
  await node.register(sentinel)
  await node.attach(sentinelAccount.address, true)
  const report = await sentinel.report()
  return report
}
