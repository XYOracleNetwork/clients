import { ArchivistInstance, asArchivistInstance } from '@xyo-network/archivist-model'
import { Module } from '@xyo-network/module-model'

import { printError } from '../../../../lib/index.js'
import { BaseArguments } from '../../../BaseArguments.js'
import { isModuleArguments, ModuleArguments } from '../../ModuleArguments.js'
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
