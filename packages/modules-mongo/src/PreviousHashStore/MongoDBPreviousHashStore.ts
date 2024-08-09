import { Address, Hash } from '@xylabs/hex'
import { PreviousHashStore } from '@xyo-network/previous-hash-store-model'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'

import { AddressInfo } from '../Mongo/index.js'

export class MongoDBPreviousHashStore implements PreviousHashStore {
  constructor(protected readonly addressInfoSdk: BaseMongoSdk<AddressInfo>) {}

  async getItem(address: Address): Promise<Hash | null> {
    const value = await this.addressInfoSdk.findOne({ address })
    return value?.previousHash ?? null
  }

  async removeItem(address: Address): Promise<void> {
    await this.addressInfoSdk.deleteOne({ address })
  }

  async setItem(address: Address, previousHash: Hash): Promise<void> {
    await this.addressInfoSdk.upsertOne({ address }, { $set: { previousHash } })
  }
}
