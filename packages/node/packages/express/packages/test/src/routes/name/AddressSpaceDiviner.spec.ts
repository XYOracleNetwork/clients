import { Account } from '@xyo-network/account'
import { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { DivinerDivineQuerySchema, DivinerInstance } from '@xyo-network/diviner-model'
import { AddressPayload, AddressSchema } from '@xyo-network/module-model'
import { WithMeta, WithSources } from '@xyo-network/payload-model'

import { getDivinerByName, getNewPayload, insertPayload, validateStateResponse } from '../../testUtil'

const divinerName = 'XYOPublic:AddressSpaceDiviner'

describe(`/${divinerName}`, () => {
  let sut: DivinerInstance
  beforeAll(async () => {
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
    const accounts: AccountInstance[] = []
    beforeAll(async () => {
      for (let i = 0; i < 5; i++) {
        const account = Account.randomSync()
        accounts.push(account)
        const payload = await getNewPayload()
        const [bw] = await new BoundWitnessBuilder().payload(payload).witness(account).build()
        await insertPayload(payload, account)
        await insertPayload(bw, account)
      }
    })
    it('returns addresses in use', async () => {
      const response = await sut.divine([])
      expect(response).toBeArray()
      expect(response.length).toBeGreaterThan(0)
      const addressPayloads = response.filter((p): p is WithSources<WithMeta<AddressPayload>> => p.schema === AddressSchema)
      const addresses = addressPayloads.map((p) => p.address)
      expect(addresses).toBeArray()
      expect(addresses.length).toBeGreaterThan(0)
      expect(addresses).toIncludeAllMembers(accounts.map((account) => account.address))
    })
  })
})
