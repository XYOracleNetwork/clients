import { assertEx } from '@xylabs/assert'
import { isUndefined } from '@xylabs/typeof'
import type { AccountInstance } from '@xyo-network/account-model'
import type { Payload } from '@xyo-network/payload-model'
import { HDWallet } from '@xyo-network/wallet'
import type {
  AllowedBlockPayload, SignedHydratedTransaction, XyoGatewayProvider,
} from '@xyo-network/xl1-protocol'
import type { RpcTransport } from '@xyo-network/xl1-rpc'
import {
  HttpRpcTransport, HttpRpcXyoConnection, MemoryXyoGateway, MemoryXyoSigner, XyoRunnerRpcSchemas, XyoViewerRpcSchemas,
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

const getGateway = async (): Promise<XyoGatewayProvider | undefined> => {
  const account = await getAccount()
  if (!account) return
  const signer = new MemoryXyoSigner(account)
  const endpoint = assertEx(process.env.XYO_CHAIN_RPC_URL, () => 'XYO_CHAIN_RPC_URL must be set')
  const transport = getRpcTransport()
  if (!transport) return
  const connection = new HttpRpcXyoConnection({ account, endpoint })
  const gateway = new MemoryXyoGateway(signer, connection)
  return gateway
}

export const sendTransaction = async (
  elevatedPayloads: AllowedBlockPayload[],
  additionalPayloads: Payload[],
): Promise<SignedHydratedTransaction | undefined> => {
  const gateway = await getGateway()
  if (!gateway) return
  return await gateway.submitTransaction?.(elevatedPayloads, additionalPayloads)
}
