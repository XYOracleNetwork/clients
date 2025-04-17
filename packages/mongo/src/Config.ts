/* eslint-disable sonarjs/deprecation */
/** @deprecated - use from @xylabs/mongo instead */
export interface BaseMongoSdkPublicConfig {
  closeDelay?: number
  collection: string
  maxPoolSize?: number
}

/** @deprecated - use from @xylabs/mongo instead */
export interface BaseMongoSdkPrivateConfig {
  dbConnectionString?: string
  dbDomain?: string
  dbName?: string
  dbPassword?: string
  dbUserName?: string
}

/** @deprecated - use from @xylabs/mongo instead */
export type BaseMongoSdkConfig = BaseMongoSdkPublicConfig & BaseMongoSdkPrivateConfig
