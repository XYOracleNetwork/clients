import type { Payload } from '@xyo-network/payload-model'
import { Ajv } from 'ajv'
import {
  describe, expect, it,
} from 'vitest'

import { validatePayloadSchema } from '../validatePayloadSchema.js'

const ajv = new Ajv()

const payloadSchema = {
  additionalProperties: true,
  properties: { schema: { type: 'string' } },
  required: ['schema'],
  type: 'object',
}
const validate = ajv.compile(payloadSchema)

const getPayload = (): Payload => {
  return { schema: 'foo' }
}

describe('validatePayloadSchema', () => {
  describe('when validator exists', () => {
    it('and payload is valid against schema returns true', async () => {
      const payload = getPayload()
      const answer = await validatePayloadSchema(payload, () => Promise.resolve(validate))
      expect(answer).toBeTruthy()
    })
    it('and payload is not valid against schema returns false', async () => {
      const payload = getPayload()
      delete (payload as Partial<Payload>).schema
      const answer = await validatePayloadSchema(payload, () => Promise.resolve(validate))
      expect(answer).toBeFalsy()
    })
  })
  describe('when validator does not exist', () => {
    it('returns true', async () => {
      const payload = getPayload()
      // eslint-disable-next-line unicorn/no-useless-undefined
      const answer = await validatePayloadSchema(payload, () => Promise.resolve(undefined))
      expect(answer).toBeTruthy()
    })
  })
})
