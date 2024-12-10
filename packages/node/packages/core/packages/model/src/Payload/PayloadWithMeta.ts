import type { EmptyObject } from '@xylabs/object'
import type { Payload } from '@xyo-network/payload-model'

import type { MongoPayloadMetaBase } from './PayloadMeta.js'

export type PayloadWithMongoMeta<T extends EmptyObject = EmptyObject> = Payload<T> & MongoPayloadMetaBase
export type PayloadWithPartialMongoMeta<T extends EmptyObject = EmptyObject> = Payload<T> & Partial<MongoPayloadMetaBase>
