import { MongoDBArchivist } from '@xyo-network/archivist-mongodb'
import type { PayloadDivinerQueryPayload } from '@xyo-network/diviner-payload-model'
import { PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { type Payload } from '@xyo-network/payload-model'
import {
  beforeAll, describe, expect, it,
} from 'vitest'

import { MongoDBPayloadDiviner } from '../MongoDBPayloadDiviner.js'

/**
 * @group module
 * @group diviner
 */

describe('MongoDBPayloadDiviner2', () => {
  let archivist: MongoDBArchivist
  let sut: MongoDBPayloadDiviner
  let node: MemoryNode
  let payloadA: Payload<{ schema: string; url: string }>
  let payloadB: Payload<{ foo: string[]; schema: string }>
  let payloadC: Payload<{ foo: string[]; schema: string }>
  let payloadD: Payload<{ foo: string[]; schema: string }>
  beforeAll(async () => {
    payloadA = {
      schema: 'network.xyo.test',
      url: 'https://xyo.network',
    }
    payloadB = {
      foo: ['bar', 'baz'],
      schema: 'network.xyo.debug.payload',
    }
    payloadC = {
      foo: ['one', 'two'],
      schema: 'network.xyo.debug.payload',
    }
    payloadD = {
      foo: ['aaa', 'bbb'],
      schema: 'network.xyo.debug.payload',
    }

    archivist = await MongoDBArchivist.create({
      account: 'random',
      config: { schema: MongoDBArchivist.defaultConfigSchema },
    })

    const insertedPayloads = await archivist.insert([payloadA, payloadB, payloadC, payloadD])

    console.log('insertedPayloads', insertedPayloads)

    sut = await MongoDBPayloadDiviner.create({
      account: 'random',
      config: {
        archivist: archivist.address,
        schema: MongoDBPayloadDiviner.defaultConfigSchema,
      },
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
        it.each(['network.xyo.test', 'network.xyo.debug.payload'])('only returns payloads of that schema', async (schema) => {
          const schemas = [schema]
          const query = new PayloadBuilder<PayloadDivinerQueryPayload>({ schema: PayloadDivinerQuerySchema }).fields({ schemas }).build()
          const results = await sut.divine([query])
          expect(results.length).toBeGreaterThan(0)
          expect(results.every(result => result.schema === schema)).toBe(true)
        })
        it('only return single payload of that schema', async () => {
          const schemas = ['network.xyo.debug.payload']
          const query = new PayloadBuilder<PayloadDivinerQueryPayload>({ schema: PayloadDivinerQuerySchema })
            .fields({ limit: 1, schemas })
            .build()
          const results = await sut.divine([query])
          expect(results.length).toBe(1)
          expect(PayloadBuilder.omitStorageMeta(results[0])).toEqual(payloadD)
          expect(await PayloadBuilder.dataHash(results[0])).toBe(await PayloadBuilder.dataHash(payloadD))
          expect(results.every(result => result.schema === 'network.xyo.debug.payload')).toBe(true)
        })
        it('only return single payload of that schema (desc)', async () => {
          const schemas = ['network.xyo.debug.payload']
          const query = new PayloadBuilder<PayloadDivinerQueryPayload>({ schema: PayloadDivinerQuerySchema })
            .fields({
              limit: 1, order: 'desc', schemas,
            })
            .build()
          const results = await sut.divine([query])
          expect(results.length).toBe(1)
          expect(PayloadBuilder.omitStorageMeta(results[0])).toEqual(payloadD)
          expect(await PayloadBuilder.dataHash(results[0])).toBe(await PayloadBuilder.dataHash(payloadD))
          expect(results.every(result => result.schema === 'network.xyo.debug.payload')).toBe(true)
        })
        it('only return single payload of that schema (asc)', async () => {
          const schemas = ['network.xyo.debug.payload']
          const query = new PayloadBuilder<PayloadDivinerQueryPayload>({ schema: PayloadDivinerQuerySchema })
            .fields({
              limit: 1, order: 'asc', schemas,
            })
            .build()
          const results = await sut.divine([query])
          expect(results.length).toBe(1)
          // expect(PayloadBuilder.omitStorageMeta(results[0])).toEqual(payloadB)
          expect(await PayloadBuilder.dataHash(results[0])).toBe(await PayloadBuilder.dataHash(payloadB))
          expect(results.every(result => result.schema === 'network.xyo.debug.payload')).toBe(true)
        })
      })
      describe('multiple', () => {
        it('only returns payloads of that schema', async () => {
          const schemas = ['network.xyo.test', 'network.xyo.debug.payload']
          const query = new PayloadBuilder<PayloadDivinerQueryPayload>({ schema: PayloadDivinerQuerySchema }).fields({ schemas }).build()
          const results = await sut.divine([query])
          expect(results.length).toBeGreaterThan(0)
          expect(results.every(result => schemas.includes(result.schema))).toBe(true)
        })
      })
    })
    describe('custom field', () => {
      describe('property', () => {
        it('only returns payloads with that property', async () => {
          type WithUrl = { url?: string }
          const url = payloadA.url
          const query = new PayloadBuilder<PayloadDivinerQueryPayload & WithUrl>({ schema: PayloadDivinerQuerySchema }).fields({ url }).build()
          const results = await sut.divine([query])
          expect(results.length).toBeGreaterThan(0)
          expect(results.every(result => (result as WithUrl)?.url === url)).toBe(true)
        })
      })
      describe('array', () => {
        const cases: string[][] = [['bar'], ['baz'], ['bar', 'baz']]
        it.each(cases)('only returns payloads that have an array containing all the values supplied', async (...foo) => {
          type WithFoo = { foo?: string[] }
          const query = new PayloadBuilder<PayloadDivinerQueryPayload & WithFoo>({ schema: PayloadDivinerQuerySchema }).fields({ foo }).build()
          const results = await sut.divine([query])
          expect(results.length).toBeGreaterThan(0)
          // eslint-disable-next-line max-nested-callbacks
          expect(results.every(result => foo.every(v => (result as unknown as WithFoo)?.foo?.includes(v)))).toBe(true)
        })
      })
    })
  })
})
