import { isUndefined } from '@xylabs/typeof'
import type { AccountInstance } from '@xyo-network/account-model'
import type {
  RpcSchemaMap, TransportFactory, XyoConnection, XyoGatewayRunner,
} from '@xyo-network/xl1-sdk'
import {
  ADDRESS_INDEX, buildJsonRpcProviderLocator, generateXyoBaseWalletFromPhrase, HttpRpcTransport, SimpleXyoGatewayRunner, SimpleXyoSigner, XyoConnectionMoniker,
  XyoSignerMoniker,
} from '@xyo-network/xl1-sdk'

const getAccount = async (): Promise<AccountInstance | undefined> => {
  const phrase = process.env.XYO_WALLET_MNEMONIC
  if (isUndefined(phrase)) return
  const wallet = await generateXyoBaseWalletFromPhrase(phrase)
  const account = await wallet.derivePath(ADDRESS_INDEX.XYO)
  return account
}

const getRpcTransportFactory = (): TransportFactory | undefined => {
  const rpcUrl = process.env.XYO_CHAIN_RPC_URL
  if (isUndefined(rpcUrl)) return
  const transportFactory: TransportFactory = (schemas: RpcSchemaMap) => new HttpRpcTransport(rpcUrl, schemas)
  return transportFactory
}

export const getGateway = async (): Promise<XyoGatewayRunner | undefined> => {
  const transportFactory = getRpcTransportFactory()
  if (isUndefined(transportFactory)) return
  const account = await getAccount()
  if (isUndefined(account)) return
  const locator = await buildJsonRpcProviderLocator({ transportFactory })
  locator.register(
    SimpleXyoSigner.factory<SimpleXyoSigner>(SimpleXyoSigner.dependencies, { account }),
  )
  const connectionProvider = await locator.getInstance<XyoConnection>(XyoConnectionMoniker)
  const signer = await locator.getInstance<SimpleXyoSigner>(XyoSignerMoniker)
  const gateway = new SimpleXyoGatewayRunner(connectionProvider, signer)
  return gateway
}
