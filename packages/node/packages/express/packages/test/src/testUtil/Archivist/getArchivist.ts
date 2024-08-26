import { assertEx } from '@xylabs/assert'
import type { AccountInstance } from '@xyo-network/account-model'
import type { ArchivistInstance } from '@xyo-network/archivist-model'
import { asArchivistInstance } from '@xyo-network/archivist-model'
import { ArchivistWrapper } from '@xyo-network/archivist-wrapper'

import { getModuleByName, getModuleByNameFromChildNode } from '../Node/index.js'

/**
 * @deprecated Use getArchivistByName instead
 */
export const getArchivist = async (account?: AccountInstance): Promise<ArchivistInstance> => {
  const archivist = asArchivistInstance(await getModuleByName('XYOPublic:Archivist'), 'Failed to cast archivist')
  return account ? ArchivistWrapper.wrap(archivist, account) : archivist
}

export const getArchivistByName = async (name: string = 'XYOPublic:Archivist', account?: AccountInstance): Promise<ArchivistInstance> => {
  const mod = assertEx(await getModuleByName(name), () => `Module not found: ${name}`)
  const archivist = asArchivistInstance(mod, 'Failed to cast archivist')
  return account ? ArchivistWrapper.wrap(archivist, account) : archivist
}

export const getArchivistByNameFromChildNode = async (name: string, childNodeName: string): Promise<ArchivistInstance> => {
  return asArchivistInstance(await getModuleByNameFromChildNode(name, childNodeName), 'Failed to cast archivist')
}
