import { BoundWitnessWithMongoMeta, PayloadWithMongoMeta } from '@xyo-network/payload-mongodb'

import { PayloadFilterPredicate } from './PayloadFilterPredicate'

export type WithoutSchemas<T> = Omit<Omit<T, 'schema'>, 'schemas'>

// TODO: Should we just accept "schema"/"schemas" here and infer that they mean "payload_schemas"?
export type BoundWitnessFilterPredicate = WithoutSchemas<PayloadFilterPredicate> & Partial<BoundWitnessWithMongoMeta & PayloadWithMongoMeta>
