import type { Address, Hash } from '@xylabs/hex'
import type { BaseMongoSdk } from '@xylabs/mongo'
import type { PreviousHashStore } from '@xyo-network/previous-hash-store-model'

import type { AddressInfo } from '../Mongo/index.js'

export class MongoDBPreviousHashStore implements PreviousHashStore {
  protected readonly addressInfoSdk
  constructor(addressInfoSdk: BaseMongoSdk<AddressInfo>) {
    this.addressInfoSdk = addressInfoSdk
  }

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
