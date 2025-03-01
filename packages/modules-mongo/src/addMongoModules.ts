import type { Container } from 'inversify'

import { addArchivistModuleFactories } from './Archivist/index.js'
import { addDivinerModuleFactories } from './Diviner/index.js'
import { JobQueueContainerModule } from './JobQueue/index.js'
import { initializeDatabase } from './Mongo/index.js'
import { addPreviousHashStore } from './PreviousHashStore/index.js'

export const addMongoModules = async (container: Container) => {
  await initializeDatabase()
  void container.load(JobQueueContainerModule)
  addArchivistModuleFactories(container)
  addDivinerModuleFactories(container)
  addPreviousHashStore()
}
