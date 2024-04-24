import { AnyObject } from '@xylabs/object'
import { PayloadDiviner } from '@xyo-network/diviner-payload-abstract'
import { isPayloadDivinerQueryPayload, PayloadDivinerConfigSchema, PayloadDivinerQueryPayload } from '@xyo-network/diviner-payload-model'
import { DefaultLimit, DefaultMaxTimeMS, DefaultOrder, MongoDBModuleMixin } from '@xyo-network/module-abstract-mongodb'
import { Payload, Schema } from '@xyo-network/payload-model'
import { fromDbRepresentation } from '@xyo-network/payload-mongodb'
import { Filter, SortDirection } from 'mongodb'

const MongoDBDivinerBase = MongoDBModuleMixin(PayloadDiviner)

export class MongoDBPayloadDiviner extends MongoDBDivinerBase {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, PayloadDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = PayloadDivinerConfigSchema

  protected override async divineHandler(payloads?: Payload[]): Promise<Payload[]> {
    const query = payloads?.find<PayloadDivinerQueryPayload>(isPayloadDivinerQueryPayload)
    // TODO: Support multiple queries
    if (!query) throw new Error('Received payload is not a Query')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, limit = DefaultLimit, offset = 0, order = DefaultOrder, schema, schemas, timestamp, ...props } = query
    const direction = order === 'asc' ? 1 : -1
    const sort: { [key: string]: SortDirection } = { _timestamp: direction }
    //TODO: Joel, why is AnyObject needed?
    const filter: Filter<AnyObject> = {}
    if (timestamp) {
      const parsedTimestamp = timestamp ?? order === 'desc' ? Date.now() : 0
      filter._timestamp = order === 'desc' ? { $lt: parsedTimestamp } : { $gt: parsedTimestamp }
    }

    // TODO: Optimize for single schema supplied too
    if (schemas?.length) filter.schema = { $in: schemas }
    // Add additional filter criteria
    if (Object.keys(props).length > 0) {
      const additionalFilterCriteria = Object.entries(props)
      for (const [prop, propFilter] of additionalFilterCriteria) {
        // Skip any reserved properties
        if (`${prop}`?.startsWith('$')) continue
        // Add the filter criteria
        // TODO: We need to decide when it makes sense for $in vs $all and expose that to the caller
        filter[prop as keyof Payload] = Array.isArray(propFilter) ? { $in: propFilter } : (propFilter as string)
      }
    }

    let result

    if (hash) {
      filter._hash = hash
      const filtered = await this.payloads.find(filter)
      result = (await filtered.sort(sort).skip(offset).limit(limit).maxTimeMS(DefaultMaxTimeMS).toArray()).map(fromDbRepresentation)
      if (result.length === 0) {
        delete filter._hash
        filter._$hash = hash
        const filtered = await this.payloads.find(filter)
        result = (await filtered.sort(sort).skip(offset).limit(limit).maxTimeMS(DefaultMaxTimeMS).toArray()).map(fromDbRepresentation)
      }
    } else {
      const filtered = await this.payloads.find(filter)
      result = (await filtered.sort(sort).skip(offset).limit(limit).maxTimeMS(DefaultMaxTimeMS).toArray()).map(fromDbRepresentation)
    }
    return result.map(fromDbRepresentation)
  }

  protected override async startHandler() {
    await super.startHandler()
    await this.ensureIndexes()
    return true
  }
}
