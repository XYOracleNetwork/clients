import type { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { TYPES } from '@xyo-network/node-core-types'
import { MemorySentinel } from '@xyo-network/sentinel-memory'
import type { Container } from 'inversify'

export const addSentinelModuleFactories = (container: Container) => {
  const locator = container.get<ModuleFactoryLocator>(TYPES.ModuleFactoryLocator)
  locator.register(MemorySentinel.factory())
}
