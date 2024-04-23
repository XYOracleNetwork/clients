import { AnyObject } from '@xylabs/object'
import { Payload } from '@xyo-network/payload-model'

import { MongoPayloadMetaBase } from './PayloadMeta'

export type MongoPayloadMeta<T extends AnyObject = AnyObject> = T & MongoPayloadMetaBase
export type MongoPartialPayloadMeta<T extends AnyObject = AnyObject> = T & Partial<MongoPayloadMetaBase>
export type MongoPayloadWithMeta<T extends AnyObject = AnyObject> = Payload<T & MongoPayloadMetaBase>
export type MongoPayloadWithPartialMeta<T extends AnyObject = AnyObject> = Payload<T & Partial<MongoPayloadMetaBase>>
