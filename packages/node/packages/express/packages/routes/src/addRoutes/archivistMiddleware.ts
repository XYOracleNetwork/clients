import { setRawResponseFormat } from '@xylabs/express'
import { asHash } from '@xylabs/hex'
import { isDefined } from '@xylabs/typeof'
import type {
  ArchivistInstance,
  ArchivistNextOptions, NextOptions,
} from '@xyo-network/archivist-model'
import { asArchivistInstance } from '@xyo-network/archivist-model'
import type { ModuleIdentifier } from '@xyo-network/module-model'
import type { NodeInstance } from '@xyo-network/node-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import { isAnyPayload, isSequence } from '@xyo-network/payload-model'
import type { Router } from 'express'
import express from 'express'
import type { Request } from 'express-serve-static-core'

const resolveArchivist = async (node: NodeInstance, archivistModuleIdentifier: ModuleIdentifier): Promise<ArchivistInstance> => {
  const mod = await node.resolve(archivistModuleIdentifier)
  return asArchivistInstance(mod, { required: true })
}

let archivistInstance: ArchivistInstance | undefined

const getArchivist = async (node: NodeInstance, archivistModuleIdentifier: ModuleIdentifier): Promise<ArchivistInstance> => {
  if (isDefined(archivistInstance)) return archivistInstance
  archivistInstance = await resolveArchivist(node, archivistModuleIdentifier)
  return archivistInstance
}

type ArchivistMiddlewareOptions = {
  archivistModuleIdentifier: ModuleIdentifier
  node: NodeInstance
}

export const archivistMiddleware = (options: ArchivistMiddlewareOptions): Router => {
  const { node, archivistModuleIdentifier } = options
  const router = express.Router({ mergeParams: true })

  router.post('/insert', async (req, res) => {
    setRawResponseFormat(res)
    const body = Array.isArray(req.body) ? req.body : [req.body]
    const payloads = (await PayloadBuilder.hashPairs<Payload>(body)).map(p => p[0])
    const archivist = await getArchivist(node, archivistModuleIdentifier)
    const result = await archivist.insert(payloads)
    res.status(200).json(result)
  })

  router.get('/next', async (req: Request<Partial<NextOptions>>, res) => {
    setRawResponseFormat(res)
    const cursor = isSequence(req.query.cursor) ? req.query.cursor : undefined
    const limit = isDefined(req.query.limit) ? Number(req.query.limit) : undefined
    const open = isDefined(req.query.open) ? Boolean(req.query.open) : undefined
    const order = req.query.order === 'asc' ? 'asc' : 'desc'
    const options: ArchivistNextOptions = {
      limit, open, order, cursor,
    }
    const archivist = await getArchivist(node, archivistModuleIdentifier)
    const result = await archivist.next(options)
    res.status(200).json(result)
  })
  router.post('/next', async (req: Request<{}, {}, ArchivistNextOptions | undefined>, res) => {
    setRawResponseFormat(res)
    const options = req.body
    const archivist = await getArchivist(node, archivistModuleIdentifier)
    const result = await (isDefined(options) ? archivist.next(options) : archivist.next())
    res.status(200).json(result)
  })

  router.get('/get/:hash', async (req, res) => {
    setRawResponseFormat(res)
    const { hash: rawHash } = req.params
    const hash = asHash(rawHash)
    if (isDefined(hash)) {
      const archivist = await getArchivist(node, archivistModuleIdentifier)
      const [payload] = await archivist.get([hash])
      if (isAnyPayload(payload)) {
        res.json(payload)
        return
      }
    }
    res.status(400).send()
  })

  return router
}
