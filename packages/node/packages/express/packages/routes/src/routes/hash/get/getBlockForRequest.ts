import type { Hash } from '@xylabs/hex'
import type { ArchivistInstance } from '@xyo-network/archivist-model'
import { asArchivistInstance } from '@xyo-network/archivist-model'
import { isPointerPayload } from '@xyo-network/node-core-model'
import type { Payload } from '@xyo-network/payload-model'
import type { Request } from 'express'

import { resolvePointer } from './resolvePointer.js'

let archivist: ArchivistInstance

export const getBlockForRequest = async (req: Request, hash: Hash): Promise<Payload | undefined> => {
  if (!archivist) {
    const { node } = req.app
    archivist = asArchivistInstance(await node.resolve('Archivist'), 'Failed to cast module to ArchivistInstance')
  }
  const block = (await archivist.get([hash])).pop()
  if (block) {
    if (isPointerPayload(block)) {
      return await resolvePointer(req, block)
    }
    return block
  }
}
