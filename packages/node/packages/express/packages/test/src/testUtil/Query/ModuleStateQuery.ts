import '@xylabs/vitest-extended'

import type { AddressPayload } from '@xyo-network/module-model'
import {
  AddressSchema, ModuleStateQuerySchema, ModuleSubscribeQuerySchema,
} from '@xyo-network/module-model'
import type { Payload } from '@xyo-network/payload-model'
import type { QueryPayload } from '@xyo-network/query-payload-plugin'
import { QuerySchema } from '@xyo-network/query-payload-plugin'
import { expect } from 'vitest'

const validateAddress = (response: Payload[]) => {
  expect(response).toBeArray()
  expect(response.length).toBeGreaterThan(0)
  const addressPayload = response.find(p => p.schema === AddressSchema) as AddressPayload
  expect(addressPayload).toBeObject()
  expect(addressPayload.address).toBeString()
  const { address } = addressPayload
  return { address }
}

const validateSupportedQueries = (response: Payload[], querySchemas: string[]) => {
  const queries = response.filter<QueryPayload>((p): p is QueryPayload => p.schema === QuerySchema)
  expect(queries.length).toBeGreaterThan(0)
  for (const querySchema of querySchemas) {
    expect(queries.some(p => p.query === querySchema)).toBeTrue()
  }
}

export const validateStateResponse = (response: Payload[], querySchemas: string[] = [ModuleStateQuerySchema, ModuleSubscribeQuerySchema]) => {
  validateAddress(response)
  validateSupportedQueries(response, querySchemas)
}
