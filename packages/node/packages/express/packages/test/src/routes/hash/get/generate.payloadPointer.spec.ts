import type { Address } from '@xylabs/hex'
import type { ArchivistInstance } from '@xyo-network/archivist-model'
import { asArchivistInstance } from '@xyo-network/archivist-model'
import { HttpBridge, HttpBridgeConfigSchema } from '@xyo-network/bridge-http'
import type {
  PayloadAddressRule, PayloadPointerPayload, PayloadSchemaRule,
} from '@xyo-network/node-core-model'
import { PayloadPointerSchema } from '@xyo-network/node-core-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { HDWallet } from '@xyo-network/wallet'
import {
  beforeAll, describe, expect,
  it,
} from 'vitest'

type DappInfo = [schema: string, address: Address]

const beta = true

const betaDapps = [
  ['network.xyo.blockchain.ethereum.gas', '85e7a0494c1feb184a80d64aca7bef07d8efd960'],
  ['network.xyo.crypto.asset', 'f90b9ad30ea94d3df17d51c727c416b46faf18b6'],
  ['network.xyo.crypto.market.uniswap', '2d0fb5708b9d68bfaa96c6e426cbc66a341f117d'],
  ['network.xyo.stock.market.tzero.snapshot', '8985400ba079e4ae51d2765e4dcac9d76df1a7f9'],
] as DappInfo[]
const prodDapps = [
  ['network.xyo.blockchain.ethereum.gas', '5b1037aa01cbba864f0908a7916b6c1de2f2be20'],
  ['network.xyo.crypto.asset', 'fce4ff8050a80076d2f95b77c61c847ae0d8b77f'],
  ['network.xyo.crypto.market.uniswap', 'd6ceab805cd617bb5b1ce86d11f24aae8ec7e26f'],
  ['network.xyo.stock.market.tzero.snapshot', '85a89bf47aa00a52f92e77291da5b20d06667a76'],
] as DappInfo[]

const cases = beta ? betaDapps : prodDapps
const nodeUrl = beta ? 'https://beta.api.archivist.xyo.network' : 'https://api.archivist.xyo.network'

describe('Generation of automation payload pointers', () => {
  let archivist: ArchivistInstance
  beforeAll(async () => {
    const schema = HttpBridgeConfigSchema
    const security = { allowAnonymous: true }
    const account = await HDWallet.random()
    const bridge = await HttpBridge.create({
      account,
      config: {
        discoverRoots: 'start', nodeUrl, schema, security,
      },
    })
    await bridge.start()
    const mod = await bridge.resolve('XYOPublic:Archivist')
    expect(mod).toBeDefined()
    archivist = asArchivistInstance(mod, () => 'Failed to cast module', { required: true })
  })
  it.each(cases)('Generates automation witness payload for %s schema', async (schema, address) => {
    const addressRule: PayloadAddressRule = { address }
    const schemaRule: PayloadSchemaRule = { schema }
    const fields = { reference: [[addressRule], [schemaRule]], schema: PayloadPointerSchema }
    const payload = new PayloadBuilder<PayloadPointerPayload>({ schema: PayloadPointerSchema }).fields(fields).build()
    const hash = await PayloadBuilder.dataHash(payload)
    const [existing] = await archivist.get([hash])
    if (!existing) {
      await archivist.insert([payload])
    }
    const url = `${nodeUrl}/${hash}`
    console.log(`Dapp: ${schema} Pointer: ${url}`)
  })
})
