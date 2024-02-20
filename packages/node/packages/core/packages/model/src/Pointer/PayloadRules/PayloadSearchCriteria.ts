import { Address } from '@xylabs/hex'
import { SortDirection } from '@xyo-network/diviner-payload-model'
import { Schema } from '@xyo-network/payload-model'

export interface PayloadSearchCriteria {
  addresses: Address[]
  direction: SortDirection
  schemas: Schema[]
  timestamp: number
}
