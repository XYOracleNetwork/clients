import { exists } from '@xylabs/exists'
import { Hash } from '@xylabs/hex'
import { AbstractArchivist } from '@xyo-network/archivist-abstract'
import { ArchivistConfigSchema, ArchivistInsertQuerySchema } from '@xyo-network/archivist-model'
import { MongoDBArchivistConfigSchema } from '@xyo-network/archivist-model-mongodb'
import { MongoDBModuleMixin } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload, WithMeta } from '@xyo-network/payload-model'
import { fromDbRepresentation, PayloadWithMongoMeta, toDbRepresentation } from '@xyo-network/payload-mongodb'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

import { validByType } from './lib'

const MongoDBArchivistBase = MongoDBModuleMixin(AbstractArchivist)

export class MongoDBArchivist extends MongoDBArchivistBase {
  static override configSchemas = [MongoDBArchivistConfigSchema, ArchivistConfigSchema]

  override readonly queries: string[] = [ArchivistInsertQuerySchema, ...super.queries]

  override async head(): Promise<Payload | undefined> {
    const head = await (await this.payloads.find({})).sort({ _timestamp: -1 }).limit(1).toArray()
    return head[0] ? PayloadWrapper.wrap(head[0]).payload : undefined
  }

  protected override async getHandler(hashes: string[]): Promise<WithMeta<Payload>[]> {
    let remainingHashes = [...hashes]

    const dataPayloads = (await Promise.all(remainingHashes.map((_$hash) => this.payloads.findOne({ _$hash })))).filter(exists)
    const dataPayloadsHashes = new Set(dataPayloads.map((payload) => payload._$hash))
    remainingHashes = remainingHashes.filter((hash) => !dataPayloadsHashes.has(hash))

    const dataBws = (await Promise.all(remainingHashes.map((_$hash) => this.boundWitnesses.findOne({ _$hash })))).filter(exists)
    const dataBwsHashes = new Set(dataBws.map((payload) => payload._$hash))
    remainingHashes = remainingHashes.filter((hash) => !dataBwsHashes.has(hash))

    const payloads = (await Promise.all(remainingHashes.map((_hash) => this.payloads.findOne({ _hash })))).filter(exists)
    const payloadsHashes = new Set(payloads.map((payload) => payload._hash))
    remainingHashes = remainingHashes.filter((hash) => !payloadsHashes.has(hash))

    const bws = (await Promise.all(remainingHashes.map((_hash) => this.boundWitnesses.findOne({ _hash })))).filter(exists)
    const bwsHashes = new Set(bws.map((payload) => payload._hash))
    remainingHashes = remainingHashes.filter((hash) => !bwsHashes.has(hash))

    const foundPayloads = [...dataPayloads, ...dataBws, ...payloads, ...bws] as PayloadWithMongoMeta<Payload & { _$hash: Hash; _$meta?: unknown }>[]
    return await PayloadBuilder.build(foundPayloads.map(fromDbRepresentation))
  }

  protected override async insertHandler(payloads: Payload[]): Promise<WithMeta<Payload>[]> {
    const [bw, p] = await validByType(payloads)
    const payloadsWithExternalMeta = await Promise.all(p.map(toDbRepresentation))
    if (payloadsWithExternalMeta.length > 0) {
      const payloadsResult = await this.payloads.insertMany(payloadsWithExternalMeta)
      if (!payloadsResult.acknowledged || payloadsResult.insertedCount !== payloadsWithExternalMeta.length)
        throw new Error('MongoDBDeterministicArchivist: Error inserting Payloads')
    }
    const boundWitnessesWithExternalMeta = await Promise.all(bw.map(toDbRepresentation))
    if (boundWitnessesWithExternalMeta.length > 0) {
      const boundWitnessesResult = await this.boundWitnesses.insertMany(boundWitnessesWithExternalMeta)
      if (!boundWitnessesResult.acknowledged || boundWitnessesResult.insertedCount !== boundWitnessesWithExternalMeta.length)
        throw new Error('MongoDBDeterministicArchivist: Error inserting BoundWitnesses')
    }

    return await PayloadBuilder.build([...boundWitnessesWithExternalMeta, ...payloadsWithExternalMeta])
  }

  protected override async startHandler() {
    await super.startHandler()
    await this.ensureIndexes()
    return true
  }
}
