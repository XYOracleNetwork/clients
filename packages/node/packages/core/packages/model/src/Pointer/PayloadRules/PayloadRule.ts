import type {
  PayloadAddressRule, PayloadOrderRule,
  PayloadSchemaRule,
} from './Rules/index.js'

export type PayloadRule = PayloadAddressRule | PayloadOrderRule | PayloadSchemaRule
