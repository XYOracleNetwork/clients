import { COLLECTIONS } from '@xyo-network/module-abstract-mongodb'
import type { IndexDescription } from 'mongodb'

export const UX_address: IndexDescription = {
  key: { address: 1 },
  name: `${COLLECTIONS.AddressInfo}.UX_address`,
  unique: true,
}
