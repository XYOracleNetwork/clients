import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import type { Address } from '@xylabs/hex'
import type { Order } from '@xyo-network/diviner-payload-model'
import type {
  PayloadRule,
  PayloadSearchCriteria,
} from '@xyo-network/node-core-model'
import {
  isPayloadAddressRule,
  isPayloadOrderRule,
  isPayloadSchemaRule,
} from '@xyo-network/node-core-model'

// TODO: Could make it so that composability is such that we:
// • AND first dimension of array
// • OR 2nd dimension of array
export const combineRules = (rules: PayloadRule[][]): PayloadSearchCriteria => {
  const addresses = rules
    .flat()
    .filter(isPayloadAddressRule)
    .map(r => r.address)
    .filter(exists) as Address[]

  const schemas = rules
    .flat()
    .filter(isPayloadSchemaRule)
    .map(r => r.schema)
    .filter(exists)
  assertEx(schemas.length, () => 'At least one schema must be supplied')

  const directionTimestamp = rules.flat().filter(isPayloadOrderRule).filter(exists)
  assertEx(directionTimestamp.length < 2, () => 'Must not supply more than 1 direction/timestamp rule')

  const order: Order = directionTimestamp[0]?.order || 'desc'

  return {
    addresses,
    order,
    schemas,
  }
}
