import type { ModuleConfig } from '@xyo-network/module-model'
import type { BaseMongoSdkPublicConfig } from '@xyo-network/sdk-xyo-mongo-js'

import type { MongoDBModuleConfigSchema } from './Schema.js'

export type MongoDBModuleConfig = ModuleConfig<{
  boundWitnessSdkConfig?: Partial<BaseMongoSdkPublicConfig>
  payloadSdkConfig?: Partial<BaseMongoSdkPublicConfig>
  schema: MongoDBModuleConfigSchema
}>
