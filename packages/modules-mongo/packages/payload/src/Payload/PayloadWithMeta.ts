import { Payload } from '@xyo-network/payload-model'

import { PayloadMongoMeta } from './PayloadMeta.js'

export type PayloadWithMongoMeta<T extends Payload = Payload> = T & PayloadMongoMeta
export type PayloadWithPartialMongoMeta<T extends Payload = Payload> = T & Partial<PayloadMongoMeta>
