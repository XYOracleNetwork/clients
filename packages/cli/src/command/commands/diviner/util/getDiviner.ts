import type { DivinerModule } from '@xyo-network/diviner-model'
import { asDivinerModule } from '@xyo-network/diviner-model'

import { printError } from '../../../../lib/index.js'
import type { ModuleArguments } from '../../ModuleArguments.js'
import { getModuleFromArgs } from '../../util/index.js'

export const getDiviner = async (args: ModuleArguments): Promise<DivinerModule> => {
  const { verbose } = args
  try {
    return asDivinerModule(await getModuleFromArgs(args), 'Failed to get Diviner', { required: true })
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Unable to obtain module for supplied address')
  }
}
