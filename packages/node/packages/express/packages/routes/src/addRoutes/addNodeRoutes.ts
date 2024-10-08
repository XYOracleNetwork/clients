import type { Express } from 'express'
import { StatusCodes } from 'http-status-codes'

import {
  getAddress, getByHash, postAddress,
} from '../routes/index.js'

export const addNodeRoutes = (app: Express) => {
  // TODO: Allow other default modules to be mounted at root
  const defaultModule = app.node
  const address = defaultModule.address
  const defaultModuleEndpoint = `/${address}`

  app.get(
    '/',
    (_req, res) => res.redirect(StatusCodes.MOVED_TEMPORARILY, defaultModuleEndpoint),
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Discovers the Node' */
  )
  app.post(
    '/',
    (_req, res) => res.redirect(StatusCodes.TEMPORARY_REDIRECT, defaultModuleEndpoint),
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Execute the supplied queries, contained as Payloads in one or more Bound Witnesses, against the Node.
    Implementation is specific to the supplied payload schemas.' */
  )
  app.get(
    '/:address',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    getAddress,
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Get the module info for the supplied address' */
  )
  app.post(
    '/:address',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    postAddress,
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Execute the supplied queries, contained as Payloads in one or more Bound Witnesses.
    Implementation is specific to the supplied payload schemas.' */
  )
  app.get(
    '/:hash',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    getByHash,
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Get the HURI from the archivist' */
  )
}
