import { assertEx } from '@xylabs/assert'
import { ModuleInstance } from '@xyo-network/module-model'

import { getBridge } from '../Bridge'

export const getModuleByName = async (name: string): Promise<ModuleInstance> => {
  const bridge = await getBridge()
  //const mods = await bridge.resolve('*')
  //console.log(toJsonString(mods, 5))
  const publicMod = await bridge.resolve('XYOPublic')
  expect(publicMod).toBeDefined()
  //console.log(`publicMod: ${toJsonString(publicMod, 5)}`)
  const module = await publicMod?.resolve(name)
  expect(module).toBeDefined()
  return assertEx(module)
}

export const getModuleByNameFromChildNode = async (name: string, childNodeName: string): Promise<ModuleInstance> => {
  const mod = await (await getModuleByName(childNodeName)).resolve(name)
  expect(mod).toBeTruthy()
  return assertEx(mod)
}
