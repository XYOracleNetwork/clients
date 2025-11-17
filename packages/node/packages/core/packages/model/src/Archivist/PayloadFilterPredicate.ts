import type { AnyObject } from '@xylabs/object'
import type { PayloadFindFilter } from '@xyo-network/payload-model'

/* TODO: Added Omit to PayloadFindFilter for offset until we support hash based offsets */

export type PayloadFilterPredicate<T extends AnyObject = AnyObject> = Partial<{
  archives: string[]
  // hash: string
  offset: number
  schemas: string[]
}>
& Omit<PayloadFindFilter, 'offset'>
& Partial<T>
