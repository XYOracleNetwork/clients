import type { NoReqParams } from '@xylabs/express'
import { setRawResponseFormat } from '@xylabs/express'
import type { RequestHandler } from 'express'
import { ReasonPhrases } from 'http-status-codes'

const message = ReasonPhrases.OK

const handler: RequestHandler<NoReqParams> = (_req, res) => {
  setRawResponseFormat(res)
  const date = new Date()
  const {
    cpuUsage, memoryUsage, uptime,
  } = process
  const data = {
    cpuUsage: cpuUsage(), date, memoryUsage: memoryUsage(), message, uptime: uptime(),
  }
  res.status(200).send(data)
}

export const getHealthz = handler
