import { EmptyObject } from '@xylabs/object'
import { Payload } from '@xyo-network/payload-model'

import { PayloadMetaBase } from './PayloadMeta'

export type PayloadMeta<T extends EmptyObject = EmptyObject> = T & PayloadMetaBase
export type PartialPayloadMeta<T extends EmptyObject = EmptyObject> = T & Partial<PayloadMetaBase>
export type PayloadWithMeta<T extends EmptyObject = EmptyObject> = Payload<T & PayloadMetaBase>
export type PayloadWithPartialMeta<T extends EmptyObject = EmptyObject> = Payload<T & Partial<PayloadMetaBase>>
