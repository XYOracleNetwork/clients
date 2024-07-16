import { ArchivistConfig } from '@xyo-network/archivist-model'
import { BaseMongoSdkPublicConfig } from '@xyo-network/sdk-xyo-mongo-js'

import { MongoDBArchivistConfigSchema } from './Schema.js'

export type MongoDBArchivistConfig = ArchivistConfig<{
  boundWitnessSdkConfig?: Partial<BaseMongoSdkPublicConfig>
  payloadSdkConfig?: Partial<BaseMongoSdkPublicConfig>
  schema: MongoDBArchivistConfigSchema
}>
