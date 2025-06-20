import type { ModuleIdentifier, ModuleInstance } from '@xyo-network/module-model'
import { asModuleInstance } from '@xyo-network/module-model'

import { printError } from '../../../lib/index.js'
import { getBridge } from '../../util/index.js'
import type { ModuleArguments } from '../ModuleArguments.js'

export const getModuleFromArgs = async (args: ModuleArguments): Promise<ModuleInstance> => {
  const { verbose } = args
  try {
    const bridge = await getBridge(args)
    const id: ModuleIdentifier | undefined = args.address ?? args.name
    const resolved = id ? await bridge.resolve(id) : undefined
    return asModuleInstance(resolved, () => `Failed to load module from id [${id}]`, { required: true })
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Unable to connect to XYO Node')
  }
}
