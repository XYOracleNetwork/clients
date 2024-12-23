import { assertEx } from '@xylabs/assert'
import type { ModuleInstance } from '@xyo-network/module-model'
import { expect } from 'vitest'

import { getBridge } from '../Bridge/index.js'

export const getModuleByName = async (name: string): Promise<ModuleInstance> => {
  const bridge = await getBridge()
  const publicMod = await bridge.resolve('XYOPublic')
  expect(publicMod).toBeDefined()
  const mod = await publicMod?.resolve(name)
  expect(mod).toBeDefined()
  return assertEx(mod)
}

export const getModuleByNameFromChildNode = async (name: string, childNodeName: string): Promise<ModuleInstance> => {
  const mod = await (await getModuleByName(childNodeName)).resolve(name)
  expect(mod).toBeTruthy()
  return assertEx(mod)
}
