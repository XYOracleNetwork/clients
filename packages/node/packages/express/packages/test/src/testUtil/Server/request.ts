import { getApp } from '@xyo-network/express-node-server'
import { Express } from 'express'
import supertest from 'supertest'

let app: Express | undefined

/**
 *
 * @returns
 * @deprecated Use global server via Node helpers instead
 */
export async function request() {
  if (!app) app = await getApp()
  return supertest(app)
}
