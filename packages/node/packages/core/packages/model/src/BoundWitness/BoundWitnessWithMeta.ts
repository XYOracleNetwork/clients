import type { AnyObject } from '@xylabs/object'
import type { BoundWitness } from '@xyo-network/boundwitness-model'

import type { MongoPayloadWithPartialMeta } from '../Payload/index.js'
import type { MongoBoundWitnessMetaBase } from './BoundWitnessMeta.js'

export type BoundWitnessMeta<T extends AnyObject = AnyObject, P extends MongoPayloadWithPartialMeta = MongoPayloadWithPartialMeta> = T &
  MongoBoundWitnessMetaBase<P>

export type PartialBoundWitnessMeta<T extends AnyObject = AnyObject, P extends MongoPayloadWithPartialMeta = MongoPayloadWithPartialMeta> = T &
  Partial<MongoBoundWitnessMetaBase<P>>

export type BoundWitnessWithMeta<T extends AnyObject = AnyObject, P extends MongoPayloadWithPartialMeta = MongoPayloadWithPartialMeta> = T &
  MongoBoundWitnessMetaBase<P> &
  BoundWitness

export type BoundWitnessWithPartialMeta<T extends AnyObject = AnyObject, P extends MongoPayloadWithPartialMeta = MongoPayloadWithPartialMeta> = T &
  Partial<MongoBoundWitnessMetaBase<P>> &
  BoundWitness
