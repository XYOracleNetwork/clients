import { exists } from '@xylabs/exists'
import type { Hash } from '@xylabs/hex'
import { AbstractArchivist } from '@xyo-network/archivist-abstract'
import type { ArchivistNextOptions } from '@xyo-network/archivist-model'
import { ArchivistInsertQuerySchema } from '@xyo-network/archivist-model'
import { MongoDBArchivistConfigSchema } from '@xyo-network/archivist-model-mongodb'
import { MongoDBModuleMixin } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type {
  Payload, Schema, WithMeta,
} from '@xyo-network/payload-model'
import type { PayloadWithMongoMeta } from '@xyo-network/payload-mongodb'
import { fromDbRepresentation, toDbRepresentation } from '@xyo-network/payload-mongodb'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import { ObjectId } from 'mongodb'

import { validByType } from './lib/index.js'

const MongoDBArchivistBase = MongoDBModuleMixin(AbstractArchivist)

export class MongoDBArchivist extends MongoDBArchivistBase {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, MongoDBArchivistConfigSchema]
  static override readonly defaultConfigSchema: Schema = MongoDBArchivistConfigSchema

  override readonly queries: string[] = [ArchivistInsertQuerySchema, ...super.queries]

  /**
   * The amount of time to allow the aggregate query to execute
   */
  protected readonly aggregateTimeoutMs = 10_000

  override async head(): Promise<Payload | undefined> {
    const head = await this.next({ limit: 1, order: 'desc' })
    return head[0] ? PayloadWrapper.wrap(head[0]).payload : undefined
  }

  protected async findOneByHash(hash: Hash) {
    const dataPayload = (await this.payloads.findOne({ _$hash: hash }))
    if (dataPayload) {
      return dataPayload
    } else {
      const dataBw = (await this.boundWitnesses.findOne({ _$hash: hash }))
      if (dataBw) {
        return dataBw
      } else {
        const payload = (await this.payloads.findOne({ _hash: hash }))
        if (payload) {
          return payload
        } else {
          const bw = (await this.boundWitnesses.findOne({ _hash: hash }))
          return bw ?? undefined
        }
      }
    }
  }

  protected override async getHandler(hashes: Hash[]): Promise<WithMeta<Payload>[]> {
    let remainingHashes = [...hashes]

    const dataPayloads = (await Promise.all(remainingHashes.map(_$hash => this.payloads.findOne({ _$hash })))).filter(exists)
    const dataPayloadsHashes = new Set(dataPayloads.map(payload => payload._$hash))
    remainingHashes = remainingHashes.filter(hash => !dataPayloadsHashes.has(hash))

    const dataBws = (await Promise.all(remainingHashes.map(_$hash => this.boundWitnesses.findOne({ _$hash })))).filter(exists)
    const dataBwsHashes = new Set(dataBws.map(payload => payload._$hash))
    remainingHashes = remainingHashes.filter(hash => !dataBwsHashes.has(hash))

    const payloads = (await Promise.all(remainingHashes.map(_hash => this.payloads.findOne({ _hash })))).filter(exists)
    const payloadsHashes = new Set(payloads.map(payload => payload._hash))
    remainingHashes = remainingHashes.filter(hash => !payloadsHashes.has(hash))

    const bws = (await Promise.all(remainingHashes.map(_hash => this.boundWitnesses.findOne({ _hash })))).filter(exists)
    const bwsHashes = new Set(bws.map(payload => payload._hash))
    remainingHashes = remainingHashes.filter(hash => !bwsHashes.has(hash))

    const foundPayloads = [...dataPayloads, ...dataBws, ...payloads, ...bws] as PayloadWithMongoMeta<Payload & { _$hash: Hash; _$meta?: unknown }>[]
    const result = await PayloadBuilder.build(foundPayloads.map(fromDbRepresentation))
    // console.log(`getHandler: ${JSON.stringify(hashes, null, 2)}:${JSON.stringify(result, null, 2)}`)
    return result
  }

  protected override async insertHandler(payloads: Payload[]): Promise<WithMeta<Payload>[]> {
    const [bw, p] = await validByType(payloads)
    const payloadsWithExternalMeta = await Promise.all(p.map((value, index) => toDbRepresentation(value, index)))
    if (payloadsWithExternalMeta.length > 0) {
      const payloadsResult = await this.payloads.insertMany(payloadsWithExternalMeta)
      if (!payloadsResult.acknowledged || payloadsResult.insertedCount !== payloadsWithExternalMeta.length)
        throw new Error('MongoDBDeterministicArchivist: Error inserting Payloads')
    }
    const boundWitnessesWithExternalMeta = await Promise.all(bw.map((value, index) => toDbRepresentation(value, index)))
    if (boundWitnessesWithExternalMeta.length > 0) {
      const boundWitnessesResult = await this.boundWitnesses.insertMany(boundWitnessesWithExternalMeta)
      if (!boundWitnessesResult.acknowledged || boundWitnessesResult.insertedCount !== boundWitnessesWithExternalMeta.length)
        throw new Error('MongoDBDeterministicArchivist: Error inserting BoundWitnesses')
    }

    return await PayloadBuilder.build([...boundWitnessesWithExternalMeta, ...payloadsWithExternalMeta])
  }

  protected override async nextHandler(options?: ArchivistNextOptions): Promise<WithMeta<Payload>[]> {
    // Sanitize inputs and set defaults
    let {
      limit, offset, order,
    } = options ?? { limit: 10, order: 'desc' }

    if (!limit) limit = 10
    if (limit > 100) limit = 100

    if (order != 'asc') order = 'desc'

    let id: ObjectId = order === 'asc' ? ObjectId.createFromTime(0) : ObjectId.createFromTime(Date.now() / 1000)
    if (offset) {
      const payload = await this.findOneByHash(offset)
      if (payload) {
        id = payload._id
      } else {
        return []
      }
    }

    // Create aggregate criteria
    const sort = order === 'asc' ? 1 : -1
    // TODO: How to handle random component of ID across multiple collections
    // to ensure we don't skip some payloads
    const match = order === 'asc' ? { _id: { $gt: id } } : { _id: { $lt: id } }

    // Run the aggregate query
    const foundPayloads = await this.payloads.useCollection((collection) => {
      return collection
        .aggregate<PayloadWithMongoMeta>([
          // Pre-filter payloads collection
          { $match: match },
          // Sort payloads by _id
          { $sort: { _id: sort } },
          // Limit payloads to the first N payloads
          { $limit: limit },
          // Combine with filtered boundWitnesses collection
          {
            $unionWith: {
              coll: this.boundWitnessSdkConfig.collection,
              pipeline: [
                { $match: match }, // Pre-filter boundWitnesses
                { $sort: { _id: sort } }, // Sort boundWitnesses by _id
                { $limit: limit }, // Limit boundWitnesses to the first N boundWitnesses
              ],
            },
          },
          // Sort the combined result by _id
          { $sort: { _id: sort } },
          // Limit the final result to N documents
          { $limit: limit },
        ])
        .maxTimeMS(this.aggregateTimeoutMs)
        .toArray()
    })

    // Convert from DB representation to Payloads
    return await PayloadBuilder.build(foundPayloads.map(fromDbRepresentation))
  }

  protected override async startHandler() {
    await super.startHandler()
    await this.ensureIndexes()
    return true
  }
}
