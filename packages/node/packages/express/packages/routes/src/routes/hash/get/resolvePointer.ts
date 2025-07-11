import { asArchivistInstance } from '@xyo-network/archivist-model'
import type { BoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-abstract'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import type { PayloadDiviner } from '@xyo-network/diviner-payload-abstract'
import { resolveByName } from '@xyo-network/express-node-lib'
import type { PointerPayload } from '@xyo-network/node-core-model'
import { TYPES } from '@xyo-network/node-core-types'
import type { Payload } from '@xyo-network/payload-model'
import type { Request } from 'express'

import { findPayload } from './findPayload.js'

export const resolvePointer = async (req: Request, pointer: PointerPayload): Promise<Payload | undefined> => {
  const { node } = req.app
  const mod = await resolveByName(node, TYPES.Archivist)
  const archivist = asArchivistInstance(mod, () => `Failed to cast archivist wrapper ${mod?.address}`, { required: true })
  const boundWitnessDiviner = asDivinerInstance(await resolveByName(node, TYPES.BoundWitnessDiviner), 'Resolved a non-Diviner') as BoundWitnessDiviner
  const payloadDiviner = asDivinerInstance(
    await resolveByName(node, TYPES.PayloadDiviner),
    () => 'Resolved a non-Diviner',
    { required: true },
  ) as PayloadDiviner
  return findPayload(archivist, boundWitnessDiviner, payloadDiviner, pointer)
}
