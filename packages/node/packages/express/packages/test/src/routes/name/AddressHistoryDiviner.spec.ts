import { Account } from '@xyo-network/account'
import { ArchivistInstance } from '@xyo-network/archivist-model'
import { DivinerDivineQuerySchema, DivinerInstance } from '@xyo-network/diviner-model'
import { AddressHistoryQueryPayload, AddressHistoryQuerySchema } from '@xyo-network/diviner-address-history-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'

import { getArchivistByName, getDivinerByName, getNewBoundWitnesses, validateStateResponse } from '../../testUtil'

const schema = AddressHistoryQuerySchema

const divinerName = 'XYOPublic:AddressHistoryDiviner'

describe(`/${divinerName}`, () => {
  const account = Account.randomSync()
  let sut: DivinerInstance
  let archivist: ArchivistInstance
  beforeAll(async () => {
    archivist = await getArchivistByName('XYOPublic:Archivist', account)
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
    const account = Account.randomSync()
    let dataHashes: string[]
    beforeAll(async () => {
      const data = await getNewBoundWitnesses([account], limit, 1)
      for (const [bw, payloads] of data) {
        await archivist.insert([bw, ...payloads])
      }
      dataHashes = await PayloadBuilder.dataHashes(data.map((d) => d[0]))
    })
    it.only('issues query', async () => {
      const address = account.address
      const query: AddressHistoryQueryPayload = { address, limit, schema }
      const response = await sut.divine([query])
      expect(response).toBeArrayOfSize(limit)
      const responseHashes = await PayloadBuilder.dataHashes(response)
      expect(responseHashes).toIncludeAllMembers(dataHashes)
    })
  })
})
