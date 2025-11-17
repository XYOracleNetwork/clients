import { assertEx } from '@xylabs/assert'
import { isUndefined } from '@xylabs/typeof'
import type { AccountInstance } from '@xyo-network/account-model'
import { HDWallet } from '@xyo-network/wallet'
import type { XyoGatewayRunner } from '@xyo-network/xl1-protocol-sdk'
import { SimpleXyoGatewayRunner, SimpleXyoSigner } from '@xyo-network/xl1-protocol-sdk'
import type { RpcTransport } from '@xyo-network/xl1-rpc'
import {
  HttpRpcTransport, HttpRpcXyoConnection, XyoRunnerRpcSchemas, XyoViewerRpcSchemas,
} from '@xyo-network/xl1-rpc'

const accountPath = "m/44'/60'/0'/0/0" as const

const getAccount = async (): Promise<AccountInstance | undefined> => {
  const phrase = process.env.XYO_WALLET_MNEMONIC
  if (isUndefined(phrase)) return
  const account = await HDWallet.fromPhrase(phrase, accountPath)
  return account
}

const getRpcTransport = (): RpcTransport<typeof XyoRunnerRpcSchemas & typeof XyoViewerRpcSchemas> | undefined => {
  const rpcUrl = process.env.XYO_CHAIN_RPC_URL
  if (isUndefined(rpcUrl)) return
  const transport = new HttpRpcTransport(rpcUrl, { ...XyoRunnerRpcSchemas, ...XyoViewerRpcSchemas })
  return transport
}

export const getGateway = async (): Promise<XyoGatewayRunner | undefined> => {
  const account = await getAccount()
  if (!account) return
  const signer = new SimpleXyoSigner(account)
  const endpoint = assertEx(process.env.XYO_CHAIN_RPC_URL, () => 'XYO_CHAIN_RPC_URL must be set')
  const transport = getRpcTransport()
  if (!transport) return
  const connection = new HttpRpcXyoConnection({ endpoint })
  const gateway = new SimpleXyoGatewayRunner(connection, signer)
  return gateway
}
