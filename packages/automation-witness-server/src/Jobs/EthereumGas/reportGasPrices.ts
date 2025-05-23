import { MemoryNode } from '@xyo-network/node-memory'
import type { Payload } from '@xyo-network/payload-model'
import { MemorySentinel } from '@xyo-network/sentinel-memory'
import type { SentinelConfig } from '@xyo-network/sentinel-model'
import { SentinelConfigSchema } from '@xyo-network/sentinel-model'
import { HDWallet } from '@xyo-network/wallet'

import { getAccount, WalletPaths } from '../../Account/index.ts'
import { getArchivists } from '../../Archivists/index.ts'
import { getProvider } from '../../Providers/index.ts'
import { getEthereumGasWitness } from '../../Witnesses/index.ts'

export const reportGasPrices = async (provider = getProvider()): Promise<Payload[]> => {
  const archivists = await getArchivists()
  const witnesses = await getEthereumGasWitness(provider)
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
  const account = await getAccount(WalletPaths.EthereumGas.Sentinel.Gas)
  const sentinel = await MemorySentinel.create({ account, config })
  await node.register(sentinel)
  await node.attach(account.address, true)
  const report = await sentinel.report()
  return report
}
