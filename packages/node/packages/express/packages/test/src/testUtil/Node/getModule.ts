import { assertEx } from '@xylabs/assert'
import { ModuleInstance } from '@xyo-network/module-model'

import { getBridge, getBridgeToChildNode } from '../Bridge'

export const getModuleByName = async (name: string): Promise<ModuleInstance> => {
  const module = await (await getBridge()).resolve(name)
  expect(module).toBeDefined()
  return assertEx(module)
}

export const getModuleByNameFromChildNode = async (name: string, childNodeName: string): Promise<ModuleInstance> => {
  const mod = await (await getBridgeToChildNode(childNodeName)).resolve(name)
  expect(mod).toBeTruthy()
  return assertEx(mod)
}
