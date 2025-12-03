import { getServer } from '@xyo-network/express-node-server'
import type { MemoryNode } from '@xyo-network/node-memory'
import z from 'zod'

import type { NodeConfigurationFunction } from '../../../model/index.js'

export const configureExpressHttpTransport: NodeConfigurationFunction = async (node: MemoryNode) => {
  // TODO: ON/OFF via presence
  // TODO: Convert port to URI to allow for local socket operation
  const port = z.number().int().safeParse(process.env.APP_PORT).data ?? 80
  await getServer(port, node)
}
