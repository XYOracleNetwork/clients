import { assertEx } from '@xylabs/assert'
import type { ModuleIdentifier, ModuleInstance } from '@xyo-network/module-model'
import type { NodeInstance } from '@xyo-network/node-model'

export const resolveByName = async (node: NodeInstance, id: ModuleIdentifier | symbol): Promise<ModuleInstance> => {
  const moduleId = typeof id === 'symbol' ? assertEx(id.description, () => 'Unable to obtain symbol description') : id
  return assertEx(await node.resolve(moduleId), () => `Unable to obtain module with name ${moduleId}`)
}
