import type { AttachableArchivistInstance } from '@xyo-network/archivist-model'
import { isAttachableArchivistInstance } from '@xyo-network/archivist-model'
import type { AttachableModuleInstance } from '@xyo-network/module-model'

import { getApiConfigs } from './getApiModuleConfig.ts'

export const getBridgedArchivist = async (bridge: AttachableModuleInstance, configs = getApiConfigs()): Promise<AttachableArchivistInstance[]> => {
  const archivists: AttachableArchivistInstance[] = []
  for (const config of configs) {
    const mod = await bridge.resolve(config.id)
    if (isAttachableArchivistInstance(mod)) {
      archivists.push(mod)
    }
  }
  return archivists
}
