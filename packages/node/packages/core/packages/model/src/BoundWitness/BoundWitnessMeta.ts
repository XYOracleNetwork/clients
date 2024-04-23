import { MongoPayloadMeta, MongoPayloadWithPartialMeta } from '../Payload'

export type MongoBoundWitnessMetaBase<P extends MongoPayloadWithPartialMeta = MongoPayloadWithPartialMeta> = MongoPayloadMeta<{
  _payloads?: P[]
  _source_ip?: string
  _user_agent?: string
}>
