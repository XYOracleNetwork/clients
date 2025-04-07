import { assertEx } from '@xylabs/assert'
import type { NoReqParams } from '@xylabs/express'
import { asyncHandler, setRawResponseFormat } from '@xylabs/express'
import { TYPES } from '@xyo-network/node-core-types'
import type { PrometheusNodeWitness } from '@xyo-network/prometheus-node-plugin'
import type { RequestHandler } from 'express'

const descriptionErrorMsg = () => 'Unable to resolve PrometheusWitness description'
const resolutionErrorMsg = () => 'Unable to resolve PrometheusNodeWitness'

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const handler: RequestHandler<NoReqParams> = async (req, res) => {
  setRawResponseFormat(res)
  const { node } = req.app
  const name = assertEx(TYPES.PrometheusWitness, descriptionErrorMsg)
  const mod = await node.resolve(name, { direction: 'down' })
  const Prometheus = assertEx(mod as PrometheusNodeWitness, resolutionErrorMsg)
  res.contentType(Prometheus.registry.contentType)
  res.end(await Prometheus.registry.metrics())
}

export const getMetrics = asyncHandler(handler)
