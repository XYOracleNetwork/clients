import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import type { Address, Hash } from '@xylabs/hex'
import { asAddress, hexFromHexString } from '@xylabs/hex'
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
import type { Filter, Sort } from 'mongodb'

const MongoDBDivinerBase = MongoDBModuleMixin(AddressHistoryDiviner)

export class MongoDBAddressHistoryDiviner extends MongoDBDivinerBase {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, AddressHistoryDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = AddressHistoryDivinerConfigSchema

  protected override async divineHandler(payloads?: Payload[]): Promise<BoundWitness[]> {
    const query = payloads?.find(isAddressHistoryQueryPayload) as AddressHistoryQueryPayload | undefined
    // TODO: Support multiple queries
    if (!query) return []

    const { address, limit } = query
    // TODO: The address field seems to be meant for the address
    // of the intended handler but is being used here to filter
    // for the query. This should be fixed to use a separate field.
    const addresses = sanitizeAddress(address)
    assertEx(addresses, () => 'MongoDBAddressHistoryDiviner: Missing address for query')
    const blocks = await this.getBlocks(addresses, limit || DefaultLimit)
    return blocks.map(fromDbRepresentation) as BoundWitness[]
  }

  protected override async startHandler() {
    await super.startHandler()
    await this.ensureIndexes()
  }

  private getBlocks = async (address: Address, limit: number): Promise<BoundWitnessWithMongoMeta[]> => {
    let nextHash: Hash | undefined = undefined
    const blocks: BoundWitnessWithMongoMeta[] = []
    const defaultFilter: Filter<BoundWitnessWithMongoMeta> = { addresses: address }
    const sort: Sort = { _sequence: -1 }
    for (let i = 0; i < limit; i++) {
      let block: BoundWitnessWithMongoMeta | undefined = undefined
      const byDataHash: Filter<BoundWitnessWithMongoMeta> = { ...defaultFilter }
      if (nextHash) byDataHash._hash = nextHash
      // eslint-disable-next-line unicorn/no-array-sort
      const foundByDataHash = (await (await this.boundWitnesses.find(byDataHash)).sort(sort).limit(1).maxTimeMS(DefaultMaxTimeMS).toArray()).pop()
      if (foundByDataHash) {
        block = foundByDataHash
      } else {
        const byRootHash: Filter<BoundWitnessWithMongoMeta> = { ...defaultFilter }
        if (nextHash) byRootHash._dataHash = nextHash
        // eslint-disable-next-line unicorn/no-array-sort
        const foundByRootHash = (await (await this.boundWitnesses.find(byRootHash)).sort(sort).limit(1).maxTimeMS(DefaultMaxTimeMS).toArray()).pop()
        if (foundByRootHash) {
          block = foundByRootHash
        }
      }
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
  return assertEx(
    (
      ([] as (string | undefined)[])
      // eslint-disable-next-line unicorn/prefer-spread
        .concat(a)
        .filter(exists)
        .map(x => x.toLowerCase())
        .map(z => asAddress(hexFromHexString(z, { prefix: false })))
        .findLast(exists)
    ), () => 'MongoDBAddressHistoryDiviner: Invalid address',
  )
}
