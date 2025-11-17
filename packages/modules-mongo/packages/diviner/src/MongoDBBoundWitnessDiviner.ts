import { flatten } from '@xylabs/array'
import { exists } from '@xylabs/exists'
import { hexFromHexString } from '@xylabs/hex'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import { BoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-abstract'
import type { BoundWitnessDivinerQueryPayload } from '@xyo-network/diviner-boundwitness-model'
import { BoundWitnessDivinerConfigSchema, isBoundWitnessDivinerQueryPayload } from '@xyo-network/diviner-boundwitness-model'
import {
  DefaultLimit, DefaultMaxTimeMS, DefaultOrder, MongoDBModuleMixin,
} from '@xyo-network/module-abstract-mongodb'
import {
  type Payload, type Schema, SequenceConstants,
} from '@xyo-network/payload-model'
import type { BoundWitnessWithMongoMeta } from '@xyo-network/payload-mongodb'
import { fromDbRepresentation } from '@xyo-network/payload-mongodb'
import type { Filter, SortDirection } from 'mongodb'

const MongoDBDivinerBase = MongoDBModuleMixin(BoundWitnessDiviner)

export class MongoDBBoundWitnessDiviner extends MongoDBDivinerBase {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, BoundWitnessDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = BoundWitnessDivinerConfigSchema

  // eslint-disable-next-line complexity
  protected override async divineHandler(payloads?: Payload[]): Promise<BoundWitness[]> {
    const query = payloads?.find<BoundWitnessDivinerQueryPayload>(isBoundWitnessDivinerQueryPayload)
    // TODO: Support multiple queries
    if (!query) return []
    // TODO: We're supporting address (which is deprecated) until we can ensure that all
    // clients are using addresses
    const {
      address,
      addresses,
      destination,
      limit = DefaultLimit,
      cursor = (query.order ?? DefaultOrder) === 'asc' ? SequenceConstants.minLocalSequence : SequenceConstants.maxLocalSequence,
      order = DefaultOrder,
      payload_hashes,
      payload_schemas,
      sourceQuery,
    } = query

    const direction = order === 'asc' ? 1 : -1
    const sort: { [key: string]: SortDirection } = { _sequence: direction }
    const filter: Filter<BoundWitnessWithMongoMeta> = {}
    if (cursor) {
      filter._sequence = order === 'desc' ? { $exists: true, $lt: cursor } : { $exists: true, $gt: cursor }
    }

    // TODO: Defaulting to $all since it makes the most sense when singing addresses are supplied
    // but based on how MongoDB implements multi-key indexes $in might be much faster and we could
    // solve the multi-sig problem via multiple API calls when multi-sig is desired instead of
    // potentially impacting performance for all single-address queries
    const allAddresses = flatten(address, addresses)
      .map(x => hexFromHexString(x, { prefix: false }))
      .filter(exists)
    if (allAddresses.length > 0) filter.addresses = allAddresses.length === 1 ? allAddresses[0] : { $all: allAddresses }
    if (payload_hashes?.length) filter.payload_hashes = { $in: payload_hashes }
    if (payload_schemas?.length) filter.payload_schemas = { $all: payload_schemas }
    if (sourceQuery) filter['_$sourceQuery'] = sourceQuery
    if (destination?.length) filter['_$destination'] = { $in: destination }
    // eslint-disable-next-line unicorn/no-array-sort
    const result = (await (await this.boundWitnesses.find(filter)).sort(sort).limit(limit).maxTimeMS(DefaultMaxTimeMS).toArray()).map(
      fromDbRepresentation,
    ) as BoundWitness[]
    return result
  }

  protected override async startHandler() {
    await super.startHandler()
    await this.ensureIndexes()
  }
}
