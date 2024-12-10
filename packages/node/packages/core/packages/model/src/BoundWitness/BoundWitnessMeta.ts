import type { PayloadWithMongoMeta, PayloadWithPartialMongoMeta } from '../Payload/index.js'

export type MongoBoundWitnessMetaBase<P extends PayloadWithPartialMongoMeta = PayloadWithPartialMongoMeta> = PayloadWithMongoMeta<{
  _payloads?: P[]
  _source_ip?: string
  _user_agent?: string
}>
