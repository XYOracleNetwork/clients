import type { NodeJobQueue } from '@xyo-network/node-core-model'

export const startJobQueue = async (jobQueue: NodeJobQueue) => {
  await jobQueue.start()
}
