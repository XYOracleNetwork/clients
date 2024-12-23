import {
  describe, expect, test,
} from 'vitest'

import { BaseMongoSdk } from '../Base.js'
import type { BaseMongoSdkConfig } from '../Config.js'

describe('Base', () => {
  test('checking happy path', () => {
    const config: BaseMongoSdkConfig = {
      collection: 'test',
      dbDomain: 'test.test.com',
      dbName: 'default',
      dbPassword: 'password',
      dbUserName: 'username',
    }
    const apiStage = new BaseMongoSdk(config)
    expect(apiStage).toBeDefined()
  })
})
