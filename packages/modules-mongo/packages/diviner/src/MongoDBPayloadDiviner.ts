import type { AnyObject } from '@xylabs/object'
import { PayloadDiviner } from '@xyo-network/diviner-payload-abstract'
import type { PayloadDivinerQueryPayload } from '@xyo-network/diviner-payload-model'
import { isPayloadDivinerQueryPayload, PayloadDivinerConfigSchema } from '@xyo-network/diviner-payload-model'
import {
  DefaultLimit, DefaultMaxTimeMS, DefaultOrder, MongoDBModuleMixin,
} from '@xyo-network/module-abstract-mongodb'
import {
  type Payload, type Schema, SequenceConstants,
} from '@xyo-network/payload-model'
import { fromDbRepresentation } from '@xyo-network/payload-mongodb'
import type { Filter, SortDirection } from 'mongodb'

const MongoDBDivinerBase = MongoDBModuleMixin(PayloadDiviner)

export class MongoDBPayloadDiviner extends MongoDBDivinerBase {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, PayloadDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = PayloadDivinerConfigSchema

  protected override async divineHandler(payloads?: Payload[]): Promise<Payload[]> {
    const query = payloads?.find(isPayloadDivinerQueryPayload) as PayloadDivinerQueryPayload
    // TODO: Support multiple queries
    if (!query) throw new Error('Received payload is not a Query')

    const {
      limit = DefaultLimit,
      cursor = (query.order ?? DefaultOrder) === 'asc' ? SequenceConstants.minLocalSequence : SequenceConstants.maxLocalSequence,
      order = DefaultOrder,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      schema,
      schemas,
      ...props
    } = query
    const direction = order === 'asc' ? 1 : -1
    const sort: { [key: string]: SortDirection } = { _sequence: direction }
    // TODO: Joel, why is AnyObject needed?
    const filter: Filter<AnyObject> = {}
    if (cursor) {
      filter._sequence = order === 'desc' ? { $lt: cursor } : { $gt: cursor }
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

    const filtered = await this.payloads.find(filter)
    result = (await filtered.sort(sort).limit(limit).maxTimeMS(DefaultMaxTimeMS).toArray()).map(fromDbRepresentation)
    return result.map(fromDbRepresentation)
  }

  protected override async startHandler() {
    await super.startHandler()
    await this.ensureIndexes()
    return true
  }
}
