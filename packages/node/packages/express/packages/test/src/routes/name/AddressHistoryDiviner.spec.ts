import { Account } from '@xyo-network/account'
import type { ArchivistInstance } from '@xyo-network/archivist-model'
import type { AddressHistoryQueryPayload } from '@xyo-network/diviner-address-history-model'
import { AddressHistoryQuerySchema } from '@xyo-network/diviner-address-history-model'
import type { DivinerInstance } from '@xyo-network/diviner-model'
import { DivinerDivineQuerySchema } from '@xyo-network/diviner-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'

import {
  getArchivistByName, getDivinerByName, getNewBoundWitnesses, validateStateResponse,
} from '../../testUtil/index.js'

const schema = AddressHistoryQuerySchema

const divinerName = 'XYOPublic:AddressHistoryDiviner'

describe(`/${divinerName}`, () => {
  const account = Account.random()
  let sut: DivinerInstance
  let archivist: ArchivistInstance
  beforeAll(async () => {
    archivist = await getArchivistByName('XYOPublic:Archivist', await account)
    sut = await getDivinerByName(divinerName)
  })
  describe('ModuleDiscoverQuerySchema', () => {
    it('issues query', async () => {
      const response = await sut.state()
      expect(response).toBeArray()
      validateStateResponse(response, [DivinerDivineQuerySchema])
    })
  })
  describe('DivinerDivineQuerySchema', () => {
    const limit = 8
    const account = Account.random()
    let dataHashes: string[]
    beforeAll(async () => {
      const data = await getNewBoundWitnesses([await account], limit, 1)
      for (const [bw, payloads] of data) {
        await archivist.insert([bw, ...payloads])
      }
      dataHashes = await PayloadBuilder.dataHashes(data.map(d => d[0]))
    })
    it.only('issues query', async () => {
      const address = (await account).address
      const query: AddressHistoryQueryPayload = {
        address, limit, schema,
      }
      const response = await sut.divine([query])
      expect(response).toBeArrayOfSize(limit)
      const responseHashes = await PayloadBuilder.dataHashes(response)
      expect(responseHashes).toIncludeAllMembers(dataHashes)
    })
  })
})
