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
  )
  app.post(
    '/',
    (_req, res) => res.redirect(StatusCodes.TEMPORARY_REDIRECT, defaultModuleEndpoint),
  )
  app.get('/:address', getAddress)
  app.post('/:address', postAddress)
  app.get('/:hash', getByHash)
}
