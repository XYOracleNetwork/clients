import { describeIf } from '@xylabs/jest-helpers'
import { Account } from '@xyo-network/account'
import { ArchivistWrapper } from '@xyo-network/archivist-wrapper'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { BoundWitnessWrapper } from '@xyo-network/boundwitness-wrapper'
import { COLLECTIONS, hasMongoDBConfig } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { PayloadWrapperBase } from '@xyo-network/payload-wrapper'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import type { BaseMongoSdkConfig } from '@xyo-network/sdk-xyo-mongo-js'

import { MongoDBArchivist } from '../Archivist.js'

describeIf(hasMongoDBConfig())('DeterministicArchivist', () => {
  const boundWitnessesConfig: BaseMongoSdkConfig = { collection: COLLECTIONS.BoundWitnesses }
  const payloadsConfig: BaseMongoSdkConfig = { collection: COLLECTIONS.Payloads }

  const payloadWrappers: PayloadWrapper[] = []
  const boundWitnessWrappers: BoundWitnessWrapper[] = []
  let archivist: ArchivistWrapper
  beforeAll(async () => {
    boundWitnessesConfig.dbConnectionString = process.env.MONGO_CONNECTION_STRING
    payloadsConfig.dbConnectionString = process.env.MONGO_CONNECTION_STRING

    const mod = await MongoDBArchivist.create({
      account: 'random',
      boundWitnessSdkConfig: boundWitnessesConfig,
      config: { schema: MongoDBArchivist.defaultConfigSchema },
      payloadSdkConfig: payloadsConfig,
    })
    archivist = new ArchivistWrapper({ mod: mod, account: await Account.random() })
    const payload1 = await PayloadBuilder.build({ nonce: 1, schema: 'network.xyo.debug' })
    const payload2 = await PayloadBuilder.build({ nonce: 2, schema: 'network.xyo.test' })
    const payload3 = await PayloadBuilder.build({ nonce: 3, schema: 'network.xyo.debug' })
    const payload4 = await PayloadBuilder.build({ nonce: 4, schema: 'network.xyo.test' })
    const payloadWrapper1 = PayloadWrapper.wrap(payload1)
    const payloadWrapper2 = PayloadWrapper.wrap(payload2)
    const payloadWrapper3 = PayloadWrapper.wrap(payload3)
    const payloadWrapper4 = PayloadWrapper.wrap(payload4)
    payloadWrappers.push(payloadWrapper1, payloadWrapper2, payloadWrapper3, payloadWrapper4)
    const signer = await Account.random()
    const boundWitness1 = (await new BoundWitnessBuilder().payload(payloadWrapper1.payload).signer(signer).build())[0]
    const boundWitness2 = (await new BoundWitnessBuilder().payload(payloadWrapper2.payload).signer(signer).build())[0]
    const boundWitness3 = (
      await new BoundWitnessBuilder().payloads([payloadWrapper3.payload, payloadWrapper4.payload]).signer(signer).build()
    )[0]
    const boundWitnessWrapper1 = BoundWitnessWrapper.parse(boundWitness1, [payload1])
    const boundWitnessWrapper2 = BoundWitnessWrapper.parse(boundWitness2, [payload2])
    const boundWitnessWrapper3 = BoundWitnessWrapper.parse(boundWitness3, [payload3, payload4])
    boundWitnessWrappers.push(boundWitnessWrapper1, boundWitnessWrapper2, boundWitnessWrapper3)
  })

  describe('discover', () => {
    it('discovers module', async () => {
      const result = await archivist.state()
      expect(result).toBeArray()
      expect(result.length).toBeGreaterThan(0)
    })
  })
  describe('insert', () => {
    beforeEach(() => {})
    type TestDataGetter<T> = () => T
    const cases: [string, TestDataGetter<PayloadWrapperBase[]>][] = [
      ['inserts single payload', () => [payloadWrappers[0]]],
      ['inserts multiple payloads', () => [payloadWrappers[0], payloadWrappers[1], payloadWrappers[2]]],
      ['inserts single boundwitness', () => [boundWitnessWrappers[0]]],
      ['inserts multiple boundwitness', () => [boundWitnessWrappers[0], boundWitnessWrappers[1], boundWitnessWrappers[2]]],
    ]
    it.each(cases)('%s', async (_title, getData) => {
      const payloads = getData().map(w => w.payload)
      const results = await archivist.insert(payloads)
      expect(results).toBeArrayOfSize(payloads.length)
    })
  })
  describe('get', () => {
    type TestDataGetter<T> = () => T
    const cases: [string, TestDataGetter<PayloadWrapperBase[]>][] = [
      ['gets single payload', () => [payloadWrappers[0]]],
      ['gets multiple payloads', () => [payloadWrappers[0], payloadWrappers[1], payloadWrappers[2]]],
      ['gets single boundwitness', () => [boundWitnessWrappers[0]]],
      ['gets multiple boundwitness', () => [boundWitnessWrappers[0], boundWitnessWrappers[1], boundWitnessWrappers[2]]],
    ]
    it.each(cases)('%s', async (_title, getData) => {
      const payloads = getData().map(w => w.payload)
      const dataHashes = await PayloadBuilder.dataHashes(payloads)
      const hashes = await PayloadBuilder.hashes(payloads)
      const dataResults = await archivist.get(dataHashes)
      const results = await archivist.get(hashes)
      expect(results).toBeTruthy()
      expect(results).toBeArrayOfSize(payloads.length)
      const resultHashes = await PayloadBuilder.hashes(results)
      const dataResultHashes = await PayloadBuilder.dataHashes(dataResults)
      await Promise.all(
        payloads.map(async (p) => {
          expect(resultHashes).toInclude(await PayloadBuilder.hash(p))
          expect(dataResultHashes).toInclude(await PayloadBuilder.dataHash(p))
        }),
      )
    })
  })
})
