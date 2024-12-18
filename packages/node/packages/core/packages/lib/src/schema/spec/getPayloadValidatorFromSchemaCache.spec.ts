import type { Payload } from '@xyo-network/payload-model'
import type { SchemaCacheEntry } from '@xyo-network/schema-cache'
import { SchemaCache } from '@xyo-network/schema-cache'
import type { MockInstance } from 'vitest'
import {
  afterAll,
  beforeAll, describe, expect, it, vi,
} from 'vitest'

import { getPayloadValidatorFromSchemaCache } from '../getPayloadValidatorFromSchemaCache.js'

const getPayload = (): Payload => {
  return { schema: 'network.xyo.test' }
}

describe('getPayloadValidatorFromSchemaCache', () => {
  describe('when validator exists', () => {
    let mock: MockInstance
    beforeAll(() => {
      const name = 'foo'
      const schema = 'network.xyo.schema'
      const definition = { $schema: 'http://json-schema.org/draft-07/schema#' }
      mock = vi.spyOn(SchemaCache.prototype, 'get').mockImplementation((_schema?: string) => {
        const entry: SchemaCacheEntry = {
          payload: {
            definition, name, schema,
          },
        }
        return Promise.resolve(entry)
      })
    })
    afterAll(() => {
      mock?.mockClear()
    })
    it('returns the validator', async () => {
      const payload = getPayload()
      const validator = await getPayloadValidatorFromSchemaCache(payload)
      expect(validator).toBeTruthy()
    })
  })
  describe('when validator does not exist', () => {
    let mock: MockInstance
    beforeAll(() => {
      mock = vi.spyOn(SchemaCache.prototype, 'get').mockImplementation((_schema?: string) => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        return Promise.resolve(undefined)
      })
    })
    afterAll(() => {
      mock?.mockClear()
    })
    it('returns undefined', async () => {
      const payload = getPayload()
      const validator = await getPayloadValidatorFromSchemaCache(payload)
      expect(validator).toBeUndefined()
    })
  })
  describe('when there is an error obtaining validator', () => {
    let mock: MockInstance
    beforeAll(() => {
      mock = vi.spyOn(SchemaCache.prototype, 'get').mockResolvedValue(null)
    })
    afterAll(() => {
      mock?.mockClear()
    })
    it('returns undefined', async () => {
      const payload = getPayload()
      const validator = await getPayloadValidatorFromSchemaCache(payload)
      expect(validator).toBeUndefined()
    })
  })
})
