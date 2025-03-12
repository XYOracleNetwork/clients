import type { AccountInstance } from '@xyo-network/account-model'
import type { Payload } from '@xyo-network/payload-model'

import { unitTestSigningAccount } from '../Account/index.js'
import { getArchivistByName } from '../Archivist/index.js'
import { getNewPayload } from './getNewPayload.js'

export const insertPayload = async (payloads?: Payload | Payload[], account?: AccountInstance): Promise<Payload[]> => {
  const archivist = await getArchivistByName('XYOPublic:Archivist', account ?? (await unitTestSigningAccount()))
  const workingPayloads = payloads ?? getNewPayload()
  const data = Array.isArray(workingPayloads) ? workingPayloads : [workingPayloads]
  return archivist.insert(data)
}
