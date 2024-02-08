import { Hash } from '@xylabs/hex'
import { JsonObject } from '@xylabs/object'
import { Payload } from '@xyo-network/payload-model'

export interface PayloadMongoMeta {
  _$hash: Hash
  _$meta?: JsonObject
  _archive?: string
  _client?: string
  _hash: Hash
  _observeDuration?: number
  _reportedHash?: string
  _schemaValid?: boolean
  _sources?: Payload[]
  _timestamp: number
  _user_agent?: string
}
