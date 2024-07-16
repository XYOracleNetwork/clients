import { Payload } from '@xyo-network/payload-model'

import { getExistingPayloadByHash } from '../Payload/index.js'

export const getHash = <T extends Payload>(hash: string): Promise<T> => {
  return getExistingPayloadByHash<T>(hash)
}
