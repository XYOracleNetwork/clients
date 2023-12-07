import { BoundWitness } from '@xyo-network/boundwitness-model'
import { AnyObject, EmptyObject } from '@xyo-network/object'

import { PayloadWithPartialMeta } from '../Payload'
import { BoundWitnessMetaBase } from './BoundWitnessMeta'

export type BoundWitnessMeta<T extends EmptyObject = EmptyObject, P extends PayloadWithPartialMeta = PayloadWithPartialMeta> = T & BoundWitnessMetaBase<P>

export type PartialBoundWitnessMeta<T extends EmptyObject = EmptyObject, P extends PayloadWithPartialMeta = PayloadWithPartialMeta> = Partial<BoundWitnessMeta<T, P>>

export type BoundWitnessWithMeta<T extends EmptyObject = EmptyObject, P extends PayloadWithPartialMeta = PayloadWithPartialMeta> = BoundWitness<T &
  BoundWitnessMetaBase<P>>

export type BoundWitnessWithPartialMeta<T extends EmptyObject = EmptyObject, P extends PayloadWithPartialMeta = PayloadWithPartialMeta> = BoundWitness<T &
  Partial<BoundWitnessMetaBase<P>>>
