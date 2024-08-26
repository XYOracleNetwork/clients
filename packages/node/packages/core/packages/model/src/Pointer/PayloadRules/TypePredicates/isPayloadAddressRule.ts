import type { PayloadRule } from '../PayloadRule.js'
import type { PayloadAddressRule } from '../Rules/index.js'

export const isPayloadAddressRule = (rule: PayloadRule): rule is PayloadAddressRule => {
  return !!(rule as PayloadAddressRule)?.address
}
