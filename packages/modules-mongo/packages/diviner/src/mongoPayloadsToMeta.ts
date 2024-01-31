import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload } from '@xyo-network/payload-model'
import { PayloadWithMongoMeta } from '@xyo-network/payload-mongodb'

export const mongoPayloadsToMeta = async <T extends Payload>(payloads: PayloadWithMongoMeta<T>[]): Promise<T[]> => {
  return (await Promise.all(
    payloads.map(({ _$hash, _$meta, ...other }) =>
      PayloadBuilder.build({
        $hash: _$hash,
        $meta: _$meta,
        ...other,
      }),
    ),
  )) as T[]
}
