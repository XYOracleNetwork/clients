import { AccountInstance } from '@xyo-network/account-model'
import { asDivinerInstance, DivinerInstance } from '@xyo-network/diviner-model'
import { DivinerWrapper } from '@xyo-network/diviner-wrapper'

import { getModuleByName, getModuleByNameFromChildNode } from '../Node'

export const getDivinerByName = async (name: string, account?: AccountInstance): Promise<DivinerInstance> => {
  const diviner = asDivinerInstance(await getModuleByName(name), 'Failed to cast diviner')
  return account ? DivinerWrapper.wrap(diviner, account) : diviner
}

export const getDivinerByNameFromChildNode = async (name: string, childNodeName: string): Promise<DivinerInstance> => {
  return asDivinerInstance(await getModuleByNameFromChildNode(name, childNodeName), 'Failed to cast diviner')
}
