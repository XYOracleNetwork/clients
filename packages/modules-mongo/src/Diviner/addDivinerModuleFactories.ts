import {
  MongoDBAddressHistoryDiviner,
  MongoDBBoundWitnessDiviner,
  MongoDBBoundWitnessStatsDiviner,
  MongoDBPayloadDiviner,
  MongoDBPayloadStatsDiviner,
  MongoDBSchemaListDiviner,
  MongoDBSchemaStatsDiviner,
} from '@xyo-network/diviner-mongodb'
import type { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import type { MongoDBModuleParams } from '@xyo-network/module-model-mongodb'
import type { JobQueue } from '@xyo-network/node-core-model'
import { TYPES } from '@xyo-network/node-core-types'
import type { Container } from 'inversify'

const getMongoDBBoundWitnessStatsDiviner = (container: Container) => {
  const jobQueue = container.get<JobQueue>(TYPES.JobQueue)
  const schema = MongoDBBoundWitnessStatsDiviner.defaultConfigSchema
  const params: MongoDBModuleParams = { config: { schema }, jobQueue }
  return ModuleFactory.withParams(MongoDBBoundWitnessStatsDiviner, params)
}
const getMongoDBPayloadStatsDiviner = (container: Container) => {
  const jobQueue = container.get<JobQueue>(TYPES.JobQueue)
  const schema = MongoDBPayloadStatsDiviner.defaultConfigSchema
  const params: MongoDBModuleParams = { config: { schema }, jobQueue }
  return ModuleFactory.withParams(MongoDBPayloadStatsDiviner, params)
}
const getMongoDBSchemaStatsDiviner = (container: Container) => {
  const jobQueue = container.get<JobQueue>(TYPES.JobQueue)
  const schema = MongoDBSchemaStatsDiviner.defaultConfigSchema
  const params: MongoDBModuleParams = { config: { schema }, jobQueue }
  return ModuleFactory.withParams(MongoDBSchemaStatsDiviner, params)
}

export const addDivinerModuleFactories = (container: Container) => {
  const locator = container.get<ModuleFactoryLocator>(TYPES.ModuleFactoryLocator)
  locator.register(MongoDBAddressHistoryDiviner.factory())
  // locator.register(MongoDBAddressSpaceDiviner)
  // locator.register(MongoDBAddressSpaceBatchDiviner)
  locator.register(MongoDBBoundWitnessDiviner.factory())
  locator.register(getMongoDBBoundWitnessStatsDiviner(container))
  locator.register(MongoDBPayloadDiviner.factory())
  locator.register(getMongoDBPayloadStatsDiviner(container))
  locator.register(MongoDBSchemaListDiviner.factory())
  locator.register(getMongoDBSchemaStatsDiviner(container))
}
