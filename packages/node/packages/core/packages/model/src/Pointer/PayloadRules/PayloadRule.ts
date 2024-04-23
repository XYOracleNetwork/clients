import { PayloadAddressRule, PayloadSchemaRule, PayloadTimestampOrderRule } from './Rules'

export type PayloadRule = PayloadAddressRule | PayloadTimestampOrderRule | PayloadSchemaRule
