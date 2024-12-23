import type { DomainPayload } from '@xyo-network/domain-payload-plugin'
import { StatusCodes } from 'http-status-codes'
import { expect } from 'vitest'

import { getRequestClient } from '../Server/index.js'

export const getDomain = async (domain: string): Promise<DomainPayload> => {
  const path = `/domain/${domain}`
  const client = getRequestClient()
  const response = await client.get(path)
  expect(response.status).toBe(StatusCodes.OK)
  return response.data.data
}
