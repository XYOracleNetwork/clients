import type { PayloadRule } from '../PayloadRule.ts'
import type { PayloadOrderRule } from '../Rules/index.ts'

export const isPayloadOrderRule = (rule: PayloadRule): rule is PayloadOrderRule => {
  return typeof (rule as PayloadOrderRule)?.order === 'string'
}
