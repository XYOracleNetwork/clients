/* eslint-disable import/no-deprecated */
import { AnyObject } from '@xylabs/object'
import { BoundWitness } from '@xyo-network/boundwitness-model'

import { PayloadWithPartialMeta } from '../Payload'
import { BoundWitnessMetaBase } from './BoundWitnessMeta'

/** @deprecated Use from @xyo-network/payload-mongodb [Only for Mongo] */
export type BoundWitnessMeta<T extends AnyObject = AnyObject, P extends PayloadWithPartialMeta = PayloadWithPartialMeta> = T & BoundWitnessMetaBase<P>

/** @deprecated Use from @xyo-network/payload-mongodb [Only for Mongo] */
export type PartialBoundWitnessMeta<T extends AnyObject = AnyObject, P extends PayloadWithPartialMeta = PayloadWithPartialMeta> = T &
  Partial<BoundWitnessMetaBase<P>>

/** @deprecated Use from @xyo-network/payload-mongodb [Only for Mongo] */
export type BoundWitnessWithMeta<T extends AnyObject = AnyObject, P extends PayloadWithPartialMeta = PayloadWithPartialMeta> = T &
  BoundWitnessMetaBase<P> &
  BoundWitness

/** @deprecated Use from @xyo-network/payload-mongodb [Only for Mongo] */
export type BoundWitnessWithPartialMeta<T extends AnyObject = AnyObject, P extends PayloadWithPartialMeta = PayloadWithPartialMeta> = T &
  Partial<BoundWitnessMetaBase<P>> &
  BoundWitness
