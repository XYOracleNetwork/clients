import type { Container } from 'inversify'

import { addArchivistModuleFactories } from './Archivist/index.js'
import { addDivinerModuleFactories } from './Diviner/index.js'
import { addSentinelModuleFactories } from './Sentinel/index.js'
import { addWitnessModuleFactories } from './Witness/index.js'

export const addMemoryModules = (container: Container) => {
  addArchivistModuleFactories(container)
  addDivinerModuleFactories(container)
  addWitnessModuleFactories(container)
  addSentinelModuleFactories(container)
}
