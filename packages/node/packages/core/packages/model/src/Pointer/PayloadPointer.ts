import type { Payload } from '@xyo-network/payload-model'
import { PayloadSchema } from '@xyo-network/payload-model'

import type { PointerPayload } from './Pointer.js'

export type PayloadPointerSchema = `${PayloadSchema}.pointer`
export const PayloadPointerSchema: PayloadPointerSchema = `${PayloadSchema}.pointer`

export type PayloadPointerPayload = PointerPayload & {
  schema: PayloadPointerSchema
}

export const isPayloadPointer = (x?: Payload | null): x is PayloadPointerPayload => x?.schema === PayloadPointerSchema
