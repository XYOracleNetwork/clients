import type { AccountInstance } from '@xyo-network/account'
import { HDWallet } from '@xyo-network/account'
import type { Signed } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'
import type { AllowedBlockPayload, TransactionBoundWitness } from '@xyo-network/xl1-model'
import type { RpcTransport } from '@xyo-network/xl1-rpc'
import {
  HttpRpcTransport,
  JsonRpcXyoRunner, MemoryXyoProvider,
  MemoryXyoSigner, XyoRunnerRpcSchemas,
} from '@xyo-network/xl1-rpc'

const accountPath = "m/44'/60'/0'/0/0" as const

const getAccount = async (): Promise<AccountInstance | undefined> => {
  const phrase = process.env.XYO_WALLET_PHRASE
  if (!phrase) return
  const account = await HDWallet.fromPhrase(phrase, accountPath)
  return account
}

const getRpcTransport = (): RpcTransport<typeof XyoRunnerRpcSchemas> | undefined => {
  const rpcUrl = process.env.XYO_CHAIN_RPC_URL
  if (!rpcUrl) return
  const transport = new HttpRpcTransport(rpcUrl, XyoRunnerRpcSchemas)
  return transport
}

const getProvider = async (): Promise<MemoryXyoProvider | undefined> => {
  const account = await getAccount()
  if (!account) return
  const signer = new MemoryXyoSigner(account)
  const transport = getRpcTransport()
  if (!transport) return
  const runner = new JsonRpcXyoRunner(transport)
  const provider = new MemoryXyoProvider({ runner, signer })
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
