import type { NodeInstance } from '@xyo-network/node-model'

export * from './addRoutes/index.ts'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      node: NodeInstance
    }
  }
}
