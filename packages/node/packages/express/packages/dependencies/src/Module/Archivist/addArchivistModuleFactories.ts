import { MemoryArchivist } from '@xyo-network/archivist-memory'
import type { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { TYPES } from '@xyo-network/node-core-types'
import type { Container } from 'inversify'

export const addArchivistModuleFactories = (container: Container) => {
  const locator = container.get<ModuleFactoryLocator>(TYPES.ModuleFactoryLocator)
  locator.register(MemoryArchivist.factory())
}
