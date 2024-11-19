import { Account } from '@xyo-network/account'
import { ArchivistInsertQuerySchema } from '@xyo-network/archivist-model'
import { QueryBoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { BoundWitness, QueryBoundWitness } from '@xyo-network/boundwitness-model'
import { BoundWitnessSchema } from '@xyo-network/boundwitness-model'
import type { AddressPayload } from '@xyo-network/module-model'
import { AddressSchema, ModuleStateQuerySchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'

import { getRequestClient, validateStateResponse } from '../../testUtil/index.ts'

describe('Root API', () => {
  const account = Account.random()
  const client = getRequestClient()
  const path = '/'
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      // Stop expected logs from being generated during tests
    })
  })
  describe('/', () => {
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
    describe('POST-Bad', () => {
      it('issues insert query to Node', async () => {
        const queryPayload = await new PayloadBuilder({ schema: ArchivistInsertQuerySchema }).build()
        const query = await (await new QueryBoundWitnessBuilder().signer(await account).query(queryPayload)).build()
        const send = [query[1], [...query[1]]]
        const response = await client.post(path, send)
        const error = response.data.error
        expect(error).toBeObject()
        expect(response.status).toBe(400)
        expect(error.schema).toBe('network.xyo.error.module')
        expect(error.message).toBe('Invalid query boundwitness')
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
        const query = await (await new QueryBoundWitnessBuilder().witness(await account).query(queryPayload)).build()
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

// const x = [{
//   $hash: 'f30d3f8e11d2e36974530bf6c65abba7b348905495812ce0207dec7ea0e3c88a',
//   $meta: {
//     signatures: [
//       'b95f0b53796956e2db7daff90732c39452120cc85106a31f9115ae299d731df21e281d14a0756733bab197d9a18186e6f77593e4f67b37de2e5bafffaf50206b',
//     ],
//     sourceQuery: 'cb5e319a006088c96ee87c3c783ce6bd808e50b8262d07bdb601d6981aba9e40',
//     timestamp: 1_731_966_459_385,
//   },
//   addresses: [
//     '2248b00eca5b2bfdde8d114d3e886562d751fbfb',
//   ],
//   payload_hashes: [],
//   payload_schemas: [],
//   previous_hashes: [
//     '5377be22a4b0e4aa82c64a6c8e6cb69369417ee42113e4987047ab5af4b04ff8',
//   ],
//   schema: 'network.xyo.boundwitness',
//   timestamp: 1_731_966_459_385,
// }]
