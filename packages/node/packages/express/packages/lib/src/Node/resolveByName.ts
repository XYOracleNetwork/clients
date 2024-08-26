import { assertEx } from '@xylabs/assert'
import type { ModuleInstance } from '@xyo-network/module-model'
import type { NodeInstance } from '@xyo-network/node-model'

export const resolveByName = async (node: NodeInstance, name: symbol | string): Promise<ModuleInstance> => {
  const description = typeof name === 'symbol' ? assertEx(name.description, () => 'Unable to obtain symbol description') : name
  const mods = await node.resolve({ name: [description] })
  const mod = assertEx(mods?.[0], () => `Unable to obtain module with name ${description}`)
  return mod
}
