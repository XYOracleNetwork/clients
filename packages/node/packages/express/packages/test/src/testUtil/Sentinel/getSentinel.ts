import type { AccountInstance } from '@xyo-network/account-model'
import type { SentinelInstance } from '@xyo-network/sentinel-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { SentinelWrapper } from '@xyo-network/sentinel-wrapper'

import { getModuleByName, getModuleByNameFromChildNode } from '../Node/index.js'

export const getSentinelByName = async (name: string, account?: AccountInstance): Promise<SentinelInstance> => {
  const diviner = asSentinelInstance(await getModuleByName(name), 'Failed to cast sentinel')
  return account ? SentinelWrapper.wrap(diviner, account) : diviner
}

export const getSentinelByNameFromChildNode = async (name: string, childNodeName: string): Promise<SentinelInstance> => {
  return asSentinelInstance(await getModuleByNameFromChildNode(name, childNodeName), 'Failed to cast sentinel')
}
