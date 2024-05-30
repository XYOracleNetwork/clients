import { assertEx } from '@xylabs/assert'
import { HDWallet } from '@xyo-network/account'
import { HttpBridge, HttpBridgeConfig, HttpBridgeConfigSchema, HttpBridgeParams } from '@xyo-network/bridge-http'
import { BridgeInstance } from '@xyo-network/bridge-model'

let bridge: HttpBridge<HttpBridgeParams>

export const getBridge = async (): Promise<BridgeInstance> => {
  if (bridge) return bridge
  const nodeUrl = assertEx(process.env.API_DOMAIN, () => 'Missing API_DOMAIN')
  console.log('nodeUrl:', nodeUrl)

  const schema = HttpBridgeConfigSchema
  const security = { allowAnonymous: true }
  const config: HttpBridgeConfig = { nodeUrl, schema, security }
  const params: HttpBridgeParams = { account: await HDWallet.random(), config }
  bridge = await HttpBridge.create(params)
  await bridge.start()
  return bridge
}

/*export const getBridgeToChildNode = async (childNodeName: string): Promise<BridgeInstance> => {
  if (bridge) return bridge
  const nodeUrl = path.join(
    assertEx(process.env.API_DOMAIN, () => 'Missing API_DOMAIN'),
    `/${childNodeName}`,
  )
  const schema = HttpBridgeConfigSchema
  const security = { allowAnonymous: true }
  const config: HttpBridgeConfig = { nodeUrl, schema, security }
  const params: HttpBridgeParams = { account: await HDWallet.random(), config }
  bridge = await HttpBridge.create(params)
  await bridge.start()
  return bridge
}*/
