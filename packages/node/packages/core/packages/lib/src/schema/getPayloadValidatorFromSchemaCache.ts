import type { GetValidator } from '@xyo-network/node-core-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import type { PayloadWithPartialMongoMeta } from '@xyo-network/payload-mongodb'
import { SchemaCache } from '@xyo-network/schema-cache'
import { SchemaPayload } from '@xyo-network/schema-payload-plugin'

import Ajv from 'ajv'

const ajv = new Ajv()

export const getPayloadValidatorFromSchemaCache: GetValidator<Payload> = async (payload) => {
  // Get the schema from the schema cache
  const schemaPayload: PayloadWithPartialMongoMeta<SchemaPayload> | undefined = (await SchemaCache.instance.get(payload.schema))?.payload
  // If it doesn't exist return undefined
  if (!schemaPayload) return
  const { definition, _hash } = schemaPayload
  // Use the schema cache payload hash as the AJV cache key to memoize
  // the AJV validator
  const key = _hash || (await PayloadBuilder.dataHash(schemaPayload))
  // Check if we already cached the validator
  const validate = ajv.getSchema(key)
  // Return the cached validator for this schema
  if (validate) return validate
  // Otherwise, compile it now
  ajv.addSchema(definition, key)
  // and return it
  return ajv.getSchema(key)
}
