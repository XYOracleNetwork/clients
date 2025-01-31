import type { ModuleConfig } from '@xyo-network/module-model'
import type { BaseMongoSdkPublicConfig } from '@xyo-network/sdk-xyo-mongo-js'

import type { MongoDBModuleConfigSchema } from './Schema.ts'

export type MongoDBModuleConfigV2 = ModuleConfig<{
  payloadSdkConfig?: Partial<BaseMongoSdkPublicConfig> | undefined
  schema: MongoDBModuleConfigSchema
}>
