import type { Payload } from '@xyo-network/payload-model'

import { BoundWitnessPointerSchema } from './BoundWitnessPointer.js'
import { PayloadPointerSchema } from './PayloadPointer.js'
import type { PointerPayload } from './Pointer.js'

export const isPointerPayload = (x?: Payload | null): x is PointerPayload =>
  x?.schema === PayloadPointerSchema || x?.schema === BoundWitnessPointerSchema
