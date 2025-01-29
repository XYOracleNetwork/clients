import '@xylabs/vitest-extended'

import { delay } from '@xylabs/delay'
import type { Address } from '@xylabs/hex'
import { Account } from '@xyo-network/account'
import type { AccountInstance } from '@xyo-network/account-model'
import { MongoDBArchivist } from '@xyo-network/archivist-mongodb'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { BoundWitnessSchema } from '@xyo-network/boundwitness-model'
import type { AddressHistoryQueryPayload } from '@xyo-network/diviner-address-history'
import { AddressHistoryQuerySchema } from '@xyo-network/diviner-address-history'
import { hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import { type BoundWitnessWithPartialMongoMeta } from '@xyo-network/payload-mongodb'
import {
  beforeAll, describe, expect, it,
} from 'vitest'

import { MongoDBAddressHistoryDiviner } from '../MongoDBAddressHistoryDiviner.js'

/**
 * @group mongo
 */
describe.runIf(hasMongoDBConfig())('MongoDBAddressHistoryDiviner', () => {
  let account: AccountInstance
  let address: Address
  let sut: MongoDBAddressHistoryDiviner

  const getNewPayload = (): Payload => {
    const fields = { salt: `${Date.now()}` }
    const result = new PayloadBuilder({ schema: 'network.xyo.test' }).fields(fields).build()
    return result
  }

  beforeAll(async () => {
    account = await Account.random()
    address = account.address
    sut = await MongoDBAddressHistoryDiviner.create({ account: 'random' })
    const archivist = await MongoDBArchivist.create({ account: 'random' })
    for (let i = 0; i < 2; i++) {
      const payload = getNewPayload()
      const [bw, payloads] = await new BoundWitnessBuilder().payload(payload).signer(account).build()
      await archivist.insert([bw, ...payloads])
      await delay(2)
    }
    await delay(1000)
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const query: AddressHistoryQueryPayload = {
          address, limit: 2, schema: AddressHistoryQuerySchema,
        }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(2)
        const actual = result[0] as BoundWitnessWithPartialMongoMeta
        expect(actual).toBeObject()
        expect(actual.schema).toBe(BoundWitnessSchema)
      })
    })
  })
})
