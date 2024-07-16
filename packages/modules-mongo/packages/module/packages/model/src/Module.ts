import { BoundWitnessWithMongoMeta, PayloadWithMongoMeta } from '@xyo-network/payload-mongodb'
import { BaseMongoSdk, BaseMongoSdkConfig } from '@xyo-network/sdk-xyo-mongo-js'

import { MongoDBStorageClassLabels } from './Labels.js'

export interface MongoDBModuleStatic<T extends MongoDBStorageClassLabels = MongoDBStorageClassLabels> {
  labels: T
}

export interface MongoDBModule {
  get boundWitnessSdkConfig(): BaseMongoSdkConfig
  get boundWitnesses(): BaseMongoSdk<BoundWitnessWithMongoMeta>
  get payloadSdkConfig(): BaseMongoSdkConfig
  get payloads(): BaseMongoSdk<PayloadWithMongoMeta>
}
