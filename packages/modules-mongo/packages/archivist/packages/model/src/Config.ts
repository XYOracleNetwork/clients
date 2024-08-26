import type { ArchivistConfig } from '@xyo-network/archivist-model'
import type { BaseMongoSdkPublicConfig } from '@xyo-network/sdk-xyo-mongo-js'

import type { MongoDBArchivistConfigSchema } from './Schema.js'

export type MongoDBArchivistConfig = ArchivistConfig<{
  boundWitnessSdkConfig?: Partial<BaseMongoSdkPublicConfig>
  payloadSdkConfig?: Partial<BaseMongoSdkPublicConfig>
  schema: MongoDBArchivistConfigSchema
}>
