import '@xylabs/vitest-extended'

import type { AccountInstance } from '@xyo-network/account-model'
import type { AbstractArchivist } from '@xyo-network/archivist-abstract'
import { BoundWitnessBuilder, QueryBoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { AbstractModule } from '@xyo-network/module-abstract'
import type { ModuleConfig } from '@xyo-network/module-model'
import { ModuleConfigSchema, ModuleStateQuerySchema } from '@xyo-network/module-model'
import type { ArchiveModuleConfig } from '@xyo-network/node-core-model'
import { ArchiveModuleConfigSchema } from '@xyo-network/node-core-model'
import type { Payload } from '@xyo-network/payload-model'
import { HDWallet } from '@xyo-network/wallet'
import type { Request } from 'express'
import {
  beforeAll, describe, expect,
  it,
} from 'vitest'
import { mock } from 'vitest-mock-extended'

import { getQueryConfig } from '../getQueryConfig.js'

const req = mock<Request>()

describe('getQueryConfig', () => {
  describe('with module', () => {
    const config: ModuleConfig = { schema: ModuleConfigSchema }
    const queries = [ModuleStateQuerySchema]
    const mod = mock<AbstractModule>({
      config,
      queries,
    })
    let testAccount1: AccountInstance
    beforeAll(async () => {
      testAccount1 = await HDWallet.create({ phrase: 'spare thunder amount street dune expect quick prison defy divert wrong thrive' })
    })
    it('generates query config for current query', async () => {
      const query = await new QueryBoundWitnessBuilder().query({ schema: ModuleStateQuerySchema }).signer(testAccount1).build()
      const config = await getQueryConfig(mod, req, query[0], query[1])
      expect(config?.security?.allowed).toContainKey(ModuleStateQuerySchema)
      expect(config?.security?.allowed?.[ModuleStateQuerySchema]).toBeArrayOfSize(1)
      expect(config?.security?.allowed?.[ModuleStateQuerySchema][0]).toEqual([testAccount1.address])
      expect(config).toMatchSnapshot()
    })
  })
  describe('with archivist', () => {
    const archive = 'temp'
    const config: ArchiveModuleConfig = { archive, schema: ArchiveModuleConfigSchema }
    const queries = [ModuleStateQuerySchema]
    const mod = mock<AbstractArchivist>({
      config,
      queries,
    })
    describe('when request can access archive', () => {
      let testAccount1: AccountInstance
      let testAccount2: AccountInstance
      let testAccount3: AccountInstance
      let testAccount4: AccountInstance
      beforeAll(async () => {
        testAccount1 = await HDWallet.fromPhrase('cushion student broken thing poet mistake item dutch traffic gloom awful still')
        testAccount2 = await HDWallet.fromPhrase('siren tenant achieve enough tone roof album champion tiny civil lottery hundred')
        testAccount3 = await HDWallet.fromPhrase('person wheat floor tumble pond develop sauce attract neither toilet build enrich')
        testAccount4 = await HDWallet.fromPhrase('kit sound script century margin into guilt region engine garment lab rifle')
        // canAccess = true
      })
      it('generates config for single-signer requests', async () => {
        const query = await new QueryBoundWitnessBuilder().query({ schema: ModuleStateQuerySchema }).signer(testAccount1).build()
        const config = await getQueryConfig(mod, req, query[0], query[1])
        expect(config).toMatchSnapshot()
      })
      it('generates config for multi-signer requests', async () => {
        const query = await new QueryBoundWitnessBuilder().query({ schema: ModuleStateQuerySchema })
          .signer(testAccount1)
          .signer(testAccount2)
          .build()
        const config = await getQueryConfig(mod, req, query[0], query[1])
        expect(config).toMatchSnapshot()
      })
      it('generates config for nested-signed requests', async () => {
        const [bw] = await new BoundWitnessBuilder().signer(testAccount3).signer(testAccount4).build()
        const query = await new QueryBoundWitnessBuilder().query({ schema: ModuleStateQuerySchema })
          .signer(testAccount1)
          .signer(testAccount2)
          .payload(bw as Payload)
          .build()
        const config = await getQueryConfig(mod, req, query[0], query[1])
        expect(config).toMatchSnapshot()
      })
      it('generates config for nested-signed multi-signer requests', async () => {
        const bw1 = await new BoundWitnessBuilder().signer(testAccount3).build()
        const bw2 = await new BoundWitnessBuilder().signer(testAccount4).build()
        const query = await new QueryBoundWitnessBuilder().query({ schema: ModuleStateQuerySchema })
          .signer(testAccount1)
          .signer(testAccount2)
          .payload(bw1[0] as Payload)
          .payload(bw2[0] as Payload)
          .build()
        const config = await getQueryConfig(mod, req, query[0], query[1])
        expect(config).toMatchSnapshot()
      })
      it('generates config for unsigned requests', async () => {
        const query = await new QueryBoundWitnessBuilder().query({ schema: ModuleStateQuerySchema }).build()
        const config = await getQueryConfig(mod, req, query[0], query[1])
        expect(config).toMatchSnapshot()
      })
    })
  })
})
