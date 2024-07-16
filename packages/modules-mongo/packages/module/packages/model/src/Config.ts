import { ModuleConfig } from '@xyo-network/module-model'
import { BaseMongoSdkPublicConfig } from '@xyo-network/sdk-xyo-mongo-js'

import { MongoDBModuleConfigSchema } from './Schema.js'

export type MongoDBModuleConfig = ModuleConfig<{
  boundWitnessSdkConfig?: Partial<BaseMongoSdkPublicConfig> | undefined
  payloadSdkConfig?: Partial<BaseMongoSdkPublicConfig> | undefined
  schema: MongoDBModuleConfigSchema
}>
