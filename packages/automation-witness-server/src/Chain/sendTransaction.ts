import { assertEx } from '@xylabs/assert'
import { HDWallet } from '@xyo-network/account'
import type { Signed } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'
import type { AllowedBlockPayload, TransactionBoundWitness } from '@xyo-network/xl1-model'
import {
  HttpRpcTransport,
  JsonRpcXyoRunner, MemoryXyoProvider,
  MemoryXyoSigner, XyoRunnerRpcSchemas,
} from '@xyo-network/xl1-rpc'

const accountPath = "m/44'/60'/0'/0/0" as const

const getProvider = async (): Promise<MemoryXyoProvider> => {
  const phrase = assertEx(process.env.XYO_WALLET_PHRASE, () => 'XYO_WALLET_PHRASE is not set')
  const account = await HDWallet.fromPhrase(phrase, accountPath)
  const rpcUrl = process.env.XYO_CHAIN_RPC_URL || 'http://localhost:3000'
  const transport = new HttpRpcTransport(rpcUrl, XyoRunnerRpcSchemas)
  const runner = new JsonRpcXyoRunner(transport)
  const signer = new MemoryXyoSigner(account)
  const provider = new MemoryXyoProvider({ runner, signer })
  return provider
}

export const sendTransaction = async (elevatedPayloads: AllowedBlockPayload[], additionalPayloads: Payload[]): Promise<Signed<TransactionBoundWitness>> => {
  const provider = await getProvider()
  return await provider.send(elevatedPayloads, additionalPayloads)
}
