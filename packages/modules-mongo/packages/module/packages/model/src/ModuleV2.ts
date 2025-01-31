import type { PayloadWithMongoMeta } from '@xyo-network/payload-mongodb'
import type { BaseMongoSdk, BaseMongoSdkConfig } from '@xyo-network/sdk-xyo-mongo-js'

export interface MongoDBModuleV2 {
  get payloadSdkConfig(): BaseMongoSdkConfig
  get payloads(): BaseMongoSdk<PayloadWithMongoMeta>
}
