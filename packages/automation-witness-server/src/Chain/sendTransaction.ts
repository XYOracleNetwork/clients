import { Account } from '@xyo-network/account'
import type { Signed } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'
import type { AllowedBlockPayload, TransactionBoundWitness } from '@xyo-network/xl1-model'
import {
  HttpRpcTransport,
  JsonRpcXyoRunner, MemoryXyoProvider,
  MemoryXyoSigner, XyoRunnerRpcSchemas,
} from '@xyo-network/xl1-rpc'

const getProvider = async (): Promise<MemoryXyoProvider> => {
  const account = await Account.random()
  const transport = new HttpRpcTransport('http://localhost:3000', XyoRunnerRpcSchemas)
  const runner = new JsonRpcXyoRunner(transport)
  const signer = new MemoryXyoSigner(account)
  const provider = new MemoryXyoProvider({ runner, signer })
  return provider
}

export const sendTransaction = async (elevatedPayloads: AllowedBlockPayload[], additionalPayloads: Payload[]): Promise<Signed<TransactionBoundWitness>> => {
  const provider = await getProvider()
  return await provider.send(elevatedPayloads, additionalPayloads)
}
