import type { ArchivistInstance } from '@xyo-network/archivist-model'
import { asArchivistInstance } from '@xyo-network/archivist-model'
import type { Module } from '@xyo-network/module-model'

import { printError } from '../../../../lib/index.js'
import type { BaseArguments } from '../../../BaseArguments.js'
import type { ModuleArguments } from '../../ModuleArguments.js'
import { isModuleArguments } from '../../ModuleArguments.js'
import { getModuleByName, getModuleFromArgs } from '../../util/index.js'

export const getArchivist = async (args: BaseArguments | ModuleArguments): Promise<ArchivistInstance> => {
  const { verbose } = args
  try {
    const mod: Module = isModuleArguments(args) ? await getModuleFromArgs(args) : await getModuleByName(args, 'Archivist')
    return asArchivistInstance(mod, () => 'Failed to get Archivist')
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Unable to obtain module for supplied address')
  }
}
