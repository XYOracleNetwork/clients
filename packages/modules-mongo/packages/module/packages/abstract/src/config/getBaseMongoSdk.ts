import { assertEx } from '@xylabs/assert'
import type { BaseMongoSdkPrivateConfig } from '@xyo-network/sdk-xyo-mongo-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import type { Document } from 'mongodb'

import { getMongoDBConfig } from './getMongoDBConfig.js'

export const getBaseMongoSdkPrivateConfig = (): BaseMongoSdkPrivateConfig => {
  const env = getMongoDBConfig()
  return {
    dbConnectionString: env.MONGO_CONNECTION_STRING,
    dbDomain: assertEx(env.MONGO_DOMAIN, () => 'Missing Mongo Domain'),
    dbName: assertEx(env.MONGO_DATABASE, () => 'Missing Mongo Database'),
    dbPassword: assertEx(env.MONGO_PASSWORD, () => 'Missing Mongo Password'),
    dbUserName: assertEx(env.MONGO_USERNAME, () => 'Missing Mongo Username'),
  }
}

export const getBaseMongoSdk = <T extends Document>(collection: string) => {
  return new BaseMongoSdk<T>({ ...getBaseMongoSdkPrivateConfig(), collection })
}
