import { PayloadRule } from '../PayloadRule'
import { PayloadTimestampOrderRule } from '../Rules'

export const isPayloadTimestampOrderRule = (rule: PayloadRule): rule is PayloadTimestampOrderRule => {
  return typeof (rule as PayloadTimestampOrderRule)?.timestamp === 'number'
}
