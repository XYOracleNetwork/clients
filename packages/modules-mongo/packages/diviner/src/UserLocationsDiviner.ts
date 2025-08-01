import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import type { Hash } from '@xylabs/hex'
import type { ArchivistInstance } from '@xyo-network/archivist-model'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { ArchivistPayloadDivinerConfig } from '@xyo-network/diviner-archivist'
import { ArchivistPayloadDivinerConfigSchema } from '@xyo-network/diviner-archivist'
import type { BoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-abstract'
import { BoundWitnessDivinerQuerySchema } from '@xyo-network/diviner-boundwitness-model'
import { CoinUserLocationsDiviner } from '@xyo-network/diviner-coin-user-locations-abstract'
import type { DivinerParams } from '@xyo-network/diviner-model'
import type { LocationPayload } from '@xyo-network/location-payload-plugin'
import { LocationSchema } from '@xyo-network/location-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type {
  Payload, Schema, WithStorageMeta,
} from '@xyo-network/payload-model'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

export type CoinCurrentUserWitnessSchema = 'co.coinapp.current.user.witness'
export const CoinCurrentUserWitnessSchema: CoinCurrentUserWitnessSchema = 'co.coinapp.current.user.witness'

export type CoinCurrentUserWitnessPayload = Payload<{
  balance?: number
  daysOld?: number
  deviceId?: string
  geomines?: number
  planType?: string
  schema: CoinCurrentUserWitnessSchema
  uid: string
}>

export type CoinCurrentLocationWitnessSchema = 'co.coinapp.current.location.witness'
export const CoinCurrentLocationWitnessSchema: CoinCurrentLocationWitnessSchema = 'co.coinapp.current.location.witness'

export type CoinCurrentLocationWitnessPayload = Payload<{
  altitudeMeters: number
  directionDegrees: number
  latitude: number
  quadkey: string
  schema: CoinCurrentLocationWitnessSchema
  speedKph: number
}>

export const isLocationPayload = (x?: Payload | null): x is LocationPayload => x?.schema === LocationSchema

export interface CoinUserLocationsDivinerParams<T extends Payload = Payload> extends DivinerParams<
  AnyConfigSchema<ArchivistPayloadDivinerConfig<T>>>
{
  archivist: ArchivistInstance
  bws: BoundWitnessDiviner
}

export class MemoryCoinUserLocationsDiviner<
  TParams extends CoinUserLocationsDivinerParams = CoinUserLocationsDivinerParams,
> extends CoinUserLocationsDiviner<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, ArchivistPayloadDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = ArchivistPayloadDivinerConfigSchema

  protected override async divineHandler(payloads?: Payload[]): Promise<LocationPayload[]> {
    const user = payloads?.find<CoinCurrentUserWitnessPayload>(
      (payload): payload is CoinCurrentUserWitnessPayload => payload?.schema === CoinCurrentUserWitnessSchema,
    )
    // If this is a query we support
    if (user) {
      const wrapper = PayloadWrapper.wrap(user)
      // TODO: Extract relevant query values here
      this.logger?.log('CoinUserLocationsDiviner.Divine: Processing query')
      // Simulating work
      const diviner = this.params.bws
      const filter = { payload_hashes: [await wrapper.dataHash()], schema: BoundWitnessDivinerQuerySchema }
      const bwList = ((await diviner.divine([filter])) as BoundWitness[]) || []
      const locationHashes = bwList.flatMap((bw) => {
        const locations: Hash[] = []
        for (let i = 0; i < bwList.length; i++) {
          if (bw?.payload_schemas[i] === CoinCurrentLocationWitnessSchema) {
            locations.push(assertEx(bw?.payload_hashes[i], () => 'Missing hash'))
          }
        }
        return locations
      })
      const locations = (await this.params.archivist.get(locationHashes)).filter(exists) as WithStorageMeta<LocationPayload>[]
      this.logger?.log('CoinUserLocationsDiviner.Divine: Processed query')
      return locations
    }
    // else return empty response
    return []
  }
}
