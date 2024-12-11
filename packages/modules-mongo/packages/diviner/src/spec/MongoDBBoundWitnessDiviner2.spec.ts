import { Account } from '@xyo-network/account'
import { MongoDBArchivist } from '@xyo-network/archivist-mongodb'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { BoundWitnessDivinerQueryPayload } from '@xyo-network/diviner-boundwitness-model'
import {
  BoundWitnessDivinerConfigSchema,
  BoundWitnessDivinerQuerySchema,
} from '@xyo-network/diviner-boundwitness-model'
import { COLLECTIONS } from '@xyo-network/module-abstract-mongodb'
import { MemoryNode } from '@xyo-network/node-memory'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import {
  beforeAll, describe, expect, it,
} from 'vitest'

import { MongoDBBoundWitnessDiviner } from '../MongoDBBoundWitnessDiviner.js'

/**
 * @group module
 * @group diviner
 */

const boundWitnessSdkConfig = {
  collection: COLLECTIONS.BoundWitnesses,
  dbConnectionString: process.env.MONGO_CONNECTION_STRING,
}

describe('MemoryBoundWitnessDiviner2', () => {
  let archivist: MongoDBArchivist
  let sut: MongoDBBoundWitnessDiviner
  let node: MemoryNode
  let payloadA: Payload<{ schema: string; url: string }>
  let payloadB: Payload<{ foo: string[]; schema: string }>
  let payloadC: Payload<{ foo: string[]; schema: string }>
  let payloadD: Payload<{ foo: string[]; schema: string }>
  const schemaA = `network.xyo.test.${Date.now()}`
  const schemaB = `network.xyo.debug.${Date.now()}`
  const bws: BoundWitness[] = []
  beforeAll(async () => {
    payloadA = {
      schema: schemaA,
      url: 'https://xyo.network',
    }
    payloadB = {
      foo: ['bar', 'baz'],
      schema: schemaB,
    }
    payloadC = {
      foo: ['one', 'two'],
      schema: schemaB,
    }
    payloadD = {
      foo: ['aaa', 'bbb'],
      schema: schemaB,
    }

    const account = await Account.random()

    const [bwA] = await BoundWitnessBuilder.build({ accounts: [account], payloads: [payloadA] })
    bws.push(bwA)
    const [bwB] = await BoundWitnessBuilder.build({ accounts: [account], payloads: [payloadB] })
    bws.push(bwB)
    const [bwC] = await BoundWitnessBuilder.build({ accounts: [account], payloads: [payloadC] })
    bws.push(bwC)
    const [bwD] = await BoundWitnessBuilder.build({ accounts: [account], payloads: [payloadD] })
    bws.push(bwD)
    const [bwAB] = await BoundWitnessBuilder.build({ accounts: [account], payloads: [payloadA, payloadB] })
    bws.push(bwAB)

    archivist = await MongoDBArchivist.create({
      account: 'random',
      config: { schema: MongoDBArchivist.defaultConfigSchema },
    })

    await archivist.insert([payloadA, payloadB])
    await archivist.insert([payloadC, payloadD])
    await archivist.insert([bwA, bwB, bwC, bwD, bwAB])
    sut = await MongoDBBoundWitnessDiviner.create({
      account: account,
      boundWitnessSdkConfig,
      config: { schema: BoundWitnessDivinerConfigSchema },
    })
    node = await MemoryNode.create({
      account: 'random',
      config: { schema: MemoryNode.defaultConfigSchema },
    })
    const modules = [archivist, sut]
    await node.start()
    await Promise.all(
      modules.map(async (mod) => {
        await node.register(mod)
        await node.attach(mod.address, true)
      }),
    )
    await sut.start()
  })
  describe('with filter for', () => {
    describe('schema', () => {
      describe('single', () => {
        it.each([schemaA, schemaB])('only returns bw that contains that schema', async (schema) => {
          const payload_schemas = [schema]
          const query = new PayloadBuilder<BoundWitnessDivinerQueryPayload>({ schema: BoundWitnessDivinerQuerySchema })
            .fields({ payload_schemas })
            .build()
          const results = await sut.divine([query])
          expect(results.length).toBeGreaterThan(0)
          expect(results.every(result => result.payload_schemas.includes(schema))).toBe(true)
        })
        it('only return single bw that contains that schema', async () => {
          const payload_schemas = [schemaB]
          const query = new PayloadBuilder<BoundWitnessDivinerQueryPayload>({ schema: BoundWitnessDivinerQuerySchema })
            .fields({
              limit: 1, order: 'asc', payload_schemas,
            })
            .build()
          const results = await sut.divine([query])
          expect(results.length).toBe(1)
          expect(await PayloadBuilder.dataHash(results[0])).toBe(await PayloadBuilder.dataHash(bws[1]))
          expect(results.every(result => result.payload_schemas.includes(schemaB))).toBe(true)
        })
        it('only return single bw that contains that schema (desc)', async () => {
          const payload_schemas = [schemaB]
          const query = new PayloadBuilder<BoundWitnessDivinerQueryPayload>({ schema: BoundWitnessDivinerQuerySchema })
            .fields({
              limit: 1, order: 'desc', payload_schemas,
            })
            .build()
          const results = await sut.divine([query])
          expect(results.length).toBe(1)
          expect(await PayloadBuilder.dataHash(results[0])).toBe(await PayloadBuilder.dataHash(bws[4]))
          expect(results.every(result => result.payload_schemas.includes(schemaB))).toBe(true)
        })
      })
      describe('multiple', () => {
        it('only returns bw that contains that schema', async () => {
          const payload_schemas = [schemaA, schemaB]
          const query = new PayloadBuilder<BoundWitnessDivinerQueryPayload>({ schema: BoundWitnessDivinerQuerySchema })
            .fields({ payload_schemas })
            .build()
          const results = await sut.divine([query])
          expect(results.length).toBeGreaterThan(0)
          expect(await PayloadBuilder.dataHash(results[0])).toBe(await PayloadBuilder.dataHash(bws[4]))
          expect(results.every(result => payload_schemas.includes(result.payload_schemas[0]))).toBe(true)
        })
      })
    })
  })
})
