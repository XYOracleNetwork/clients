import type { BoundWitness, QueryBoundWitness } from '@xyo-network/boundwitness-model'
import { BoundWitnessSchema } from '@xyo-network/boundwitness-model'
import type { AbstractModule } from '@xyo-network/module-abstract'
import type { Module, ModuleConfig } from '@xyo-network/module-model'
import { ModuleConfigSchema } from '@xyo-network/module-model'
import type { ArchiveModuleConfig } from '@xyo-network/node-core-model'
import type { Payload } from '@xyo-network/payload-model'
import type { Request } from 'express'

const nestedBwAddressesDepth = 5 as const

export const getQueryConfig = async (mod: Module, req: Request, bw: QueryBoundWitness, payloads?: Payload[]): Promise<ModuleConfig | undefined> => {
  const archivist = mod as unknown as AbstractModule
  const config = archivist?.config as unknown as ArchiveModuleConfig
  const archive = config?.archive
  // TODO: Filter based on query addresses?
  const requestCanAccessArchive = await Promise.resolve(true)
  if (archive && requestCanAccessArchive) {
    // Recurse through payloads for nested BWs
    const nestedBwAddresses
      = payloads
        ?.flat(nestedBwAddressesDepth)
        .filter<BoundWitness>((payload): payload is BoundWitness => payload?.schema === BoundWitnessSchema)
        .map(bw => bw.addresses) || []
    const addresses = [bw.addresses, ...nestedBwAddresses].filter(address => address.length)
    const allowed = addresses.length > 0 ? Object.fromEntries(archivist.queries.map(schema => [schema, addresses])) : {}
    const security = { allowed }
    return { schema: ModuleConfigSchema, security }
  }
}
