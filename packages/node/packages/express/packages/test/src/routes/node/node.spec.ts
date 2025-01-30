import { Account } from '@xyo-network/account'
import { QueryBoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { BoundWitness, QueryBoundWitness } from '@xyo-network/boundwitness-model'
import { BoundWitnessSchema } from '@xyo-network/boundwitness-model'
import type { AddressPayload } from '@xyo-network/module-model'
import { AddressSchema, ModuleStateQuerySchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import {
  beforeAll, describe, expect, it, vi,
} from 'vitest'

import { getRequestClient, validateStateResponse } from '../../testUtil/index.js'

describe('Node API', () => {
  const account = Account.random()
  const client = getRequestClient()
  const path = '/node'
  beforeAll(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {
      // Stop expected logs from being generated during tests
    })
  })
  describe('/node', () => {
    describe('GET', () => {
      it('returns node describe', async () => {
        const response = await client.get(path)
        const data = response.data.data
        validateStateResponse(data)
      })
    })
    describe('POST', () => {
      it('issues query to Node', async () => {
        const queryPayload = await new PayloadBuilder({ schema: ModuleStateQuerySchema }).build()
        const query = await (await new QueryBoundWitnessBuilder().signer(await account).query(queryPayload)).build()
        const send = [query[0], [...query[1]]]
        const response = await client.post(path, send)
        const data = response.data.data
        expect(data).toBeTruthy()
        const [bw, payloads] = data
        expect(bw).toBeObject()
        expect(bw.schema).toBe(BoundWitnessSchema)
        validateStateResponse(payloads)
      })
    })
  })
  describe('/<address>', () => {
    let address: string | undefined
    beforeAll(async () => {
      const response = await client.get<{ data: Payload[] }>(path)
      const data = response.data.data
      const { address: parentAddress } = getModuleAddress(data)
      const child = data.find(p => p.schema === AddressSchema && (p as AddressPayload)?.address !== parentAddress) as AddressPayload
      address = child.address
    })
    describe('GET', () => {
      it('returns module describe', async () => {
        const response = await client.get<{ data: Payload[] }>(path)
        const data = response.data.data
        validateStateResponse(data)
      })
      it('can get Node by address', async () => {
        const nodeResponse = await client.get<{ data: Payload[] }>(path)
        const data = nodeResponse.data.data
        const { address: nodeAddress } = getModuleAddress(data)
        const response = await client.get<{ data: Payload[] }>(`/${nodeAddress}`)
        validateStateResponse(response.data.data)
      })
    })
    describe('POST', () => {
      const postModuleQuery = async (data: [QueryBoundWitness, Payload[]], address?: string): Promise<[BoundWitness, Payload[]]> => {
        const path = address ? `/node/${address}` : '/node'
        const response = await client.post(path, data)
        expect(response).toBeTruthy()
        expect(response.data.data).toBeArray()
        const [bw, payloads] = response.data.data
        expect(bw).toBeObject()
        expect(bw.schema).toBe(BoundWitnessSchema)
        expect(payloads).toBeArray()
        expect(payloads.length).toBeGreaterThan(0)
        return [bw, payloads]
      }
      it('issues query to module at address', async () => {
        const queryPayload = await new PayloadBuilder({ schema: ModuleStateQuerySchema }).build()
        const query = await (await new QueryBoundWitnessBuilder().signer(await account).query(queryPayload)).build()
        const data = [query[0], [...query[1]]] as [QueryBoundWitness, Payload[]]
        await postModuleQuery(data, address)
      })
    })
  })
})

const getModuleAddress = (data: Payload[]) => {
  expect(data).toBeArray()
  expect(data.length).toBeGreaterThan(0)
  const addressPayload = data.find(p => p.schema === AddressSchema) as AddressPayload
  expect(addressPayload).toBeObject()
  expect(addressPayload.address).toBeString()
  const { address } = addressPayload
  return { address }
}
