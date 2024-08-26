import { BoundWitnessSchema } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'

import type { PointerPayload } from './Pointer.js'

export type BoundWitnessPointerSchema = `${BoundWitnessSchema}.pointer`
export const BoundWitnessPointerSchema: BoundWitnessPointerSchema = `${BoundWitnessSchema}.pointer`

export type BoundWitnessPointerPayload = PointerPayload & {
  schema: BoundWitnessPointerSchema
}

export const isBoundWitnessPointer = (x?: Payload | null): x is BoundWitnessPointerPayload => x?.schema === BoundWitnessPointerSchema
