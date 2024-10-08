import type { Payload } from '@xyo-network/payload-model'

import { getRequestClient } from '../Server/index.js'

export const getExistingPayloadByHash = async <T extends Payload = Payload>(hash: string): Promise<T> => {
  const client = getRequestClient()
  const response = await client.get<T>(`/${hash}`)
  return response.data
}
