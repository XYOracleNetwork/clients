import type { ArchivistInstance } from '@xyo-network/archivist-model'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { AbstractDiviner } from '@xyo-network/diviner-abstract'
import type { BoundWitnessDivinerQueryPayload } from '@xyo-network/diviner-boundwitness-model'
import type { DivinerParams } from '@xyo-network/diviner-model'
import { mock } from 'jest-mock-extended'

import type { CoinCurrentUserWitnessPayload } from '../UserLocationsDiviner.js'
import { CoinCurrentUserWitnessSchema, MemoryCoinUserLocationsDiviner } from '../UserLocationsDiviner.js'

describe.skip('MemoryCoinUserLocationsDiviner', () => {
  const archivist = mock<ArchivistInstance>()
  const bws = mock<AbstractDiviner<DivinerParams, BoundWitnessDivinerQueryPayload, BoundWitness>>()
  const logger = mock<Console>()
  let sut: MemoryCoinUserLocationsDiviner
  beforeAll(async () => {
    sut = await MemoryCoinUserLocationsDiviner.create({
      archivist,
      bws,
      config: { schema: MemoryCoinUserLocationsDiviner.defaultConfigSchema },
    })
    sut.params.logger = logger
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const query: CoinCurrentUserWitnessPayload = { schema: CoinCurrentUserWitnessSchema, uid: 'test' }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(0)
        // const actual = result[0] as Payload
        // expect(actual).toBeObject()
        // expect(actual.schema).toBe(LocationSchema)
      })
    })
  })
})
