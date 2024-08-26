import type { AccountInstance } from '@xyo-network/account-model'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { Payload, WithMeta } from '@xyo-network/payload-model'

import { unitTestSigningAccount } from '../Account/index.js'
import { getArchivistByName } from '../Archivist/index.js'
import { getNewBlock } from './getNewBlock.js'

export const insertBlock = async (boundWitnesses?: BoundWitness | BoundWitness[], account?: AccountInstance): Promise<WithMeta<Payload>[]> => {
  boundWitnesses = boundWitnesses ?? (await getNewBlock())
  const archivist = await getArchivistByName('XYOPublic:Archivist', account ?? (await unitTestSigningAccount()))
  const data = Array.isArray(boundWitnesses) ? boundWitnesses : [boundWitnesses]
  return archivist.insert(data)
}
