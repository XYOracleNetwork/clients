import { asModuleInstance, ModuleInstance } from '@xyo-network/module-model'

import { printError } from '../../../lib/index.js'
import { getBridge } from '../../util/index.js'
import { ModuleArguments } from '../ModuleArguments.js'
import { getModuleFilterFromArgs } from './getModuleFilterFromArgs.js'

export const getModuleFromArgs = async (args: ModuleArguments): Promise<ModuleInstance> => {
  const { verbose } = args
  try {
    const bridge = await getBridge(args)
    const filter = getModuleFilterFromArgs(args)
    const resolved = await bridge.resolve(filter)
    return asModuleInstance(resolved.pop(), `Failed to load module from filter [${filter}]`)
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Unable to connect to XYO Node')
  }
}
