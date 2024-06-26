import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { TYPES } from '@xyo-network/node-core-types'
import { Container } from 'inversify'

export const addArchivistModuleFactories = (container: Container) => {
  const locator = container.get<ModuleFactoryLocator>(TYPES.ModuleFactoryLocator)
  locator.register(MemoryArchivist)
}
