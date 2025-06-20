import { isUndefined } from '@xylabs/typeof'
import type { AccountInstance } from '@xyo-network/account-model'
import type { Signed } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'
import { HDWallet } from '@xyo-network/wallet'
import type { AllowedBlockPayload, TransactionBoundWitness } from '@xyo-network/xl1-protocol'
import type { RpcTransport } from '@xyo-network/xl1-rpc'
import {
  HttpRpcTransport, JsonRpcXyoRunner, JsonRpcXyoViewer, MemoryXyoProvider, MemoryXyoSigner, MemoryXyoWallet, XyoRunnerRpcSchemas, XyoViewerRpcSchemas,
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

const getProvider = async (): Promise<MemoryXyoProvider | undefined> => {
  const account = await getAccount()
  if (!account) return
  const signer = new MemoryXyoSigner(account)
  const transport = getRpcTransport()
  if (!transport) return
  const runner = new JsonRpcXyoRunner(transport)
  const viewer = new JsonRpcXyoViewer(transport)
  const wallet = new MemoryXyoWallet(account)
  const chainId = await viewer.chainId()
  wallet.addChain(chainId, 'XL1')
  wallet.switchChain(chainId)
  const provider = new MemoryXyoProvider({
    runner, signer, viewer, wallet,
  })
  return provider
}

export const sendTransaction = async (
  elevatedPayloads: AllowedBlockPayload[],
  additionalPayloads: Payload[],
): Promise<Signed<TransactionBoundWitness> | undefined> => {
  const provider = await getProvider()
  if (!provider) return
  return await provider.send(elevatedPayloads, additionalPayloads)
}
