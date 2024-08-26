import type { Address } from '@xylabs/hex'
import { SchemaListDiviner } from '@xyo-network/diviner-schema-list-abstract'
import type {
  SchemaListPayload,
  SchemaListQueryPayload,
} from '@xyo-network/diviner-schema-list-model'
import {
  isSchemaListQueryPayload,
  SchemaListDivinerConfigSchema,
  SchemaListDivinerSchema,
} from '@xyo-network/diviner-schema-list-model'
import { MongoDBModuleMixin } from '@xyo-network/module-abstract-mongodb'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload, Schema } from '@xyo-network/payload-model'

const MongoDBDivinerBase = MongoDBModuleMixin(SchemaListDiviner)

export class MongoDBSchemaListDiviner extends MongoDBDivinerBase {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, SchemaListDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = SchemaListDivinerConfigSchema

  protected override async divineHandler(payloads?: Payload[]): Promise<Payload<SchemaListPayload>[]> {
    const query = payloads?.find<SchemaListQueryPayload>(isSchemaListQueryPayload)
    const addresses
      = query?.address
        ? Array.isArray(query?.address)
          ? query.address
          : [query.address]
        : undefined
    const counts = addresses ? await Promise.all(addresses.map(address => this.divineAddress(address))) : [await this.divineAllAddresses()]
    return await Promise.all(
      counts.map(schemas => new PayloadBuilder<SchemaListPayload>({ schema: SchemaListDivinerSchema }).fields({ schemas }).build()),
    )
  }

  protected override async startHandler() {
    await super.startHandler()
    await this.ensureIndexes()
    return true
  }

  private divineAddress = async (archive: Address): Promise<Schema[]> => {
    const result = await this.boundWitnesses.useCollection((collection) => {
      return collection.distinct('payload_schemas', { addresses: { $in: [archive] } })
    })
    return result
  }

  private divineAllAddresses = async (): Promise<string[]> => {
    const result = await this.boundWitnesses.useCollection((collection) => {
      return collection.distinct('payload_schemas')
    })
    return result
  }
}
