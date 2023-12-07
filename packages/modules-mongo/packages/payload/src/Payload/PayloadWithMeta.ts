import { AnyObject, EmptyObject } from '@xyo-network/object'
import { Payload } from '@xyo-network/payload-model'

import { PayloadMetaBase } from './PayloadMeta'

export type PayloadMeta<T extends EmptyObject = AnyObject> = T & PayloadMetaBase
export type PartialPayloadMeta<T extends EmptyObject = AnyObject> = T & Partial<PayloadMetaBase>
export type PayloadWithMeta<T extends EmptyObject = AnyObject> = Payload<T & PayloadMetaBase>
export type PayloadWithPartialMeta<T extends EmptyObject = AnyObject> = Payload<T & Partial<PayloadMetaBase>>
