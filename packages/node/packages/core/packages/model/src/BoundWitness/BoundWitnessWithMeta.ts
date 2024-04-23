import { AnyObject } from '@xylabs/object'
import { BoundWitness } from '@xyo-network/boundwitness-model'

import { MongoPayloadWithPartialMeta } from '../Payload'
import { MongoBoundWitnessMetaBase } from './BoundWitnessMeta'

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
