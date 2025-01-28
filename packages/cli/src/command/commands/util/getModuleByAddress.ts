import type { Address } from '@xylabs/hex'
import {
  asModuleInstance, type Module, type ModuleIdentifier,
} from '@xyo-network/module-model'

import { printError } from '../../../lib/index.ts'
import type { BaseArguments } from '../../BaseArguments.js'
import { getBridge } from '../../util/index.ts'

export const getModuleByAddress = async (args: BaseArguments, address: Address): Promise<Module> => {
  const { verbose } = args
  try {
    const bridge = await getBridge(args)
    const id: ModuleIdentifier | undefined = address
    const resolved = id ? await bridge.resolve(id) : undefined
    return asModuleInstance(resolved, `Failed to load module from id [${id}]`)
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Unable to connect to XYO Node')
  }
}
