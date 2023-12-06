import type { EventEmitter } from 'node:stream'

import { Task } from '@xyo-network/shared'

/** @internal */
export interface DefineOptions {
  lockLifetime?: number
}

/** @internal */
export interface JobQueue extends EventEmitter {
  define: (name: string, options: DefineOptions, processor: Task) => void
  every: (
    interval: string,
    names: string | string[],
    //  data?: any,
    //  options?: JobOptions
  ) => Promise<void>
  start: () => Promise<unknown>
}
