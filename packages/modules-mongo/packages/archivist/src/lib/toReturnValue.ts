import { deepOmitPrefixedFields } from '@xyo-network/hash'
import { Payload } from '@xyo-network/payload-model'

export const toReturnValue = (value: Payload): Payload => {
  return deepOmitPrefixedFields(value, '_')
}
