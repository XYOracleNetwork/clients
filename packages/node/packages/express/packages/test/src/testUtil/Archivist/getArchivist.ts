import { AccountInstance } from '@xyo-network/account-model'
import { ArchivistInstance, asArchivistInstance } from '@xyo-network/archivist-model'
import { ArchivistWrapper } from '@xyo-network/archivist-wrapper'

import { getModuleByName, getModuleByNameFromChildNode } from '../Node'

/**
 * @deprecated Use getArchivistByName instead
 */
export const getArchivist = async (account?: AccountInstance): Promise<ArchivistInstance> => {
  const archivist = asArchivistInstance(await getModuleByName('Archivist'), 'Failed to cast archivist')
  return account ? ArchivistWrapper.wrap(archivist, account) : archivist
}

export const getArchivistByName = async (name: string = 'Archivist', account?: AccountInstance): Promise<ArchivistInstance> => {
  const archivist = asArchivistInstance(await getModuleByName(name), 'Failed to cast archivist')
  return account ? ArchivistWrapper.wrap(archivist, account) : archivist
}

export const getArchivistByNameFromChildNode = async (name: string, childNodeName: string): Promise<ArchivistInstance> => {
  return asArchivistInstance(await getModuleByNameFromChildNode(name, childNodeName), 'Failed to cast archivist')
}
