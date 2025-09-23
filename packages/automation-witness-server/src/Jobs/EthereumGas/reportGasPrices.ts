import { MemoryNode } from '@xyo-network/node-memory'
import type { Payload } from '@xyo-network/payload-model'
import { MemorySentinel } from '@xyo-network/sentinel-memory'
import type { SentinelConfig } from '@xyo-network/sentinel-model'
import { SentinelConfigSchema } from '@xyo-network/sentinel-model'
import { HDWallet } from '@xyo-network/wallet'

import { getAccount, WalletPaths } from '../../Account/index.ts'
import { getBridge, getBridgedArchivist } from '../../Archivists/index.ts'
import { getProvider } from '../../Providers/index.ts'
import { getEthereumGasWitness } from '../../Witnesses/index.ts'

export const reportGasPrices = async (provider = getProvider()): Promise<Payload[]> => {
  // Create a memory node to attach modules to
  const node = await MemoryNode.create({ account: await HDWallet.random() })

  // Get the bridge
  const bridge = await getBridge()

  // Get the witnesses
  const witnesses = await getEthereumGasWitness(provider)

  // Get the sentinel
  const archivists = await getBridgedArchivist(bridge)
  const config: SentinelConfig = {
    archiving: { archivists: archivists.map(mod => mod.address) },
    schema: SentinelConfigSchema,
    synchronous: true,
    tasks: witnesses.map(mod => ({ mod: mod.address })),
  }
  const account = await getAccount(WalletPaths.EthereumGas.Sentinel.Gas)
  const sentinel = await MemorySentinel.create({ account, config })

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
