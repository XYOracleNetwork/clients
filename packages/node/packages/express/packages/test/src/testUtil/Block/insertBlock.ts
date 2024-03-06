import { AccountInstance } from '@xyo-network/account-model'
import { BoundWitness } from '@xyo-network/boundwitness-model'
import { Payload } from '@xyo-network/payload-model'

import { unitTestSigningAccount } from '../Account'
import { getArchivistByName } from '../Archivist'
import { getNewBlock } from './getNewBlock'

export const insertBlock = async (boundWitnesses?: BoundWitness | BoundWitness[], account?: AccountInstance): Promise<Payload[]> => {
  boundWitnesses = boundWitnesses ?? (await getNewBlock())
  const archivist = await getArchivistByName('Archivist', account ?? (await unitTestSigningAccount()))
  const data = Array.isArray(boundWitnesses) ? boundWitnesses : [boundWitnesses]
  return archivist.insert(data)
}
