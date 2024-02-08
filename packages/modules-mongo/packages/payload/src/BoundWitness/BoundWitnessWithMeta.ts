import { BoundWitness } from '@xyo-network/boundwitness-model'

import { PayloadWithPartialMongoMeta } from '../Payload'
import { BoundWitnessMongoMeta } from './BoundWitnessMeta'

export type BoundWitnessWithMongoMeta<
  T extends BoundWitness = BoundWitness,
  P extends PayloadWithPartialMongoMeta<T> = PayloadWithPartialMongoMeta<T>,
> = T & BoundWitnessMongoMeta<P>

export type BoundWitnessWithPartialMongoMeta<
  T extends BoundWitness = BoundWitness,
  P extends PayloadWithPartialMongoMeta<T> = PayloadWithPartialMongoMeta<T>,
> = T & Partial<BoundWitnessMongoMeta<P>>
