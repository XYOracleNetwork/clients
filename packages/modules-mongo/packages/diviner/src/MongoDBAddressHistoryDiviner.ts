import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import type { Address, Hash } from '@xylabs/hex'
import { hexFromHexString } from '@xylabs/hex'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { AddressHistoryQueryPayload } from '@xyo-network/diviner-address-history'
import {
  AddressHistoryDiviner,
  AddressHistoryDivinerConfigSchema,
  isAddressHistoryQueryPayload,
} from '@xyo-network/diviner-address-history'
import {
  DefaultLimit, DefaultMaxTimeMS, MongoDBModuleMixin,
} from '@xyo-network/module-abstract-mongodb'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { BoundWitnessWithMongoMeta } from '@xyo-network/payload-mongodb'
import { fromDbRepresentation } from '@xyo-network/payload-mongodb'
import type { Filter } from 'mongodb'

const MongoDBDivinerBase = MongoDBModuleMixin(AddressHistoryDiviner)

export class MongoDBAddressHistoryDiviner extends MongoDBDivinerBase {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, AddressHistoryDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = AddressHistoryDivinerConfigSchema

  protected override async divineHandler(payloads?: Payload[]): Promise<BoundWitness[]> {
    const query = payloads?.find<AddressHistoryQueryPayload>(isAddressHistoryQueryPayload)
    // TODO: Support multiple queries
    if (!query) return []

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      address, schema, limit, offset, order, ...props
    } = query
    // TODO: The address field seems to be meant for the address
    // of the intended handler but is being used here to filter
    // for the query. This should be fixed to use a separate field.
    const addresses = sanitizeAddress(address)
    assertEx(addresses, () => 'MongoDBAddressHistoryDiviner: Missing address for query')
    if (offset) assertEx(typeof offset === 'string', () => 'MongoDBAddressHistoryDiviner: Supplied offset must be a hash')
    const hash = offset as Hash
    const blocks = await this.getBlocks(hash, addresses, limit || DefaultLimit)
    return blocks.map(fromDbRepresentation) as BoundWitness[]
  }

  protected override async startHandler() {
    await super.startHandler()
    await this.ensureIndexes()
    return true
  }

  private getBlocks = async (hash: Hash, address: Address, limit: number): Promise<BoundWitnessWithMongoMeta[]> => {
    let nextHash = hash
    const blocks: BoundWitnessWithMongoMeta[] = []
    for (let i = 0; i < limit; i++) {
      const filter: Filter<BoundWitnessWithMongoMeta> = { addresses: address }
      if (nextHash) filter._$hash = nextHash
      const found = await this.boundWitnesses.find(filter)
      const block = (await found.sort({ _timestamp: -1 }).limit(1).maxTimeMS(DefaultMaxTimeMS).toArray()).pop()
      if (!block) break
      blocks.push(block)
      const addressIndex = block.addresses.indexOf(address)
      const previousHash = block.previous_hashes[addressIndex]
      if (!previousHash) break
      nextHash = previousHash
    }
    return blocks
  }
}

const sanitizeAddress = (a: string | string[] | undefined): Address => {
  return (
    ([] as (string | undefined)[])
      // eslint-disable-next-line unicorn/prefer-spread
      .concat(a)
      .filter(exists)
      .map(x => x.toLowerCase())
      .map(z => hexFromHexString(z, { prefix: false }))
      .filter(exists)
      // TODO: We're only taking the last address with this
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce(x => x)
  )
}
