import { HDWallet } from '@xyo-network/account'
import { MemoryNode } from '@xyo-network/node-memory'
import { Payload } from '@xyo-network/payload-model'
import { MemorySentinel } from '@xyo-network/sentinel-memory'
import { SentinelConfig, SentinelConfigSchema } from '@xyo-network/sentinel-model'

import { getAccount, WalletPaths } from '../../Account/index.js'
import { getArchivists } from '../../Archivists/index.js'
import { getProvider } from '../../Providers/index.js'
import { getEthereumGasWitness } from '../../Witnesses/index.js'

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
    archiving: {
      archivists: archivists.map(mod => mod.address),
    },
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
