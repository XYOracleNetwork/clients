import { Payload } from '@xyo-network/payload-model'

import { PayloadWithMongoMeta, PayloadWithPartialMongoMeta } from '../Payload'

export type BoundWitnessMongoMeta<P extends Payload = Payload> = PayloadWithMongoMeta<
  P & {
    _payloads?: PayloadWithPartialMongoMeta<P>[]
    _source_ip?: string
    _user_agent?: string
  }
>
