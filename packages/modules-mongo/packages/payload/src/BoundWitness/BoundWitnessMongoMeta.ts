import type { Payload } from '@xyo-network/payload-model'

import type { PayloadWithMongoMeta } from '../Payload/index.ts'

export type BoundWitnessMongoMeta<P extends Payload = Payload> = PayloadWithMongoMeta<
  P & {
    // _payloads?: PayloadWithPartialMongoMeta<P>[]
    _source_ip?: string
    _user_agent?: string
  }
>
