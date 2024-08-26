import type { Payload } from '@xyo-network/payload-model'

import type { PayloadRule } from './PayloadRules/index.js'

export type PointerPayload = Payload<{
  reference: PayloadRule[][]
}>
