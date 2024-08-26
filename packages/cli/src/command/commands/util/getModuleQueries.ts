import type { ModuleInstance } from '@xyo-network/module-model'
import type { QueryPayload } from '@xyo-network/query-payload-plugin'
import { QuerySchema } from '@xyo-network/query-payload-plugin'

export const getModuleQueries = async (mod: ModuleInstance): Promise<string[]> => {
  return (await mod.state()).filter<QueryPayload>((p): p is QueryPayload => p.schema === QuerySchema).map(p => p.query)
}
