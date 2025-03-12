import type { AnyConfigSchema, ModuleParams } from '@xyo-network/module-model'
import type { JobQueue } from '@xyo-network/node-core-model'
import type { BaseMongoSdkPrivateConfig, BaseMongoSdkPublicConfig } from '@xyo-network/sdk-xyo-mongo-js'

import type { MongoDBModuleConfigV2 } from './ConfigV2.ts'

export type MongoDBModuleParamsV2 = ModuleParams<
  AnyConfigSchema<MongoDBModuleConfigV2>,
  {
    jobQueue?: JobQueue
    payloadSdkConfig?: (BaseMongoSdkPrivateConfig & Partial<BaseMongoSdkPublicConfig>)
  }
>
