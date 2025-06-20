import { filterAs } from '@xylabs/array'
import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import {
  asApiCallJsonResult, asApiCallResult, isApiCallJsonResult,
} from '@xyo-network/api-call-witness'
import type { ArchivistInstance } from '@xyo-network/archivist-model'
import type { DivinerInstance } from '@xyo-network/diviner-model'
import type { NodeInstance } from '@xyo-network/node-model'
import { asNodeInstance } from '@xyo-network/node-model'
import type { WithSources } from '@xyo-network/payload-model'
import type { SentinelInstance } from '@xyo-network/sentinel-model'
import {
  beforeAll, describe, expect, it,
} from 'vitest'

import {
  getArchivistByNameFromChildNode, getBridge, getDivinerByNameFromChildNode, getSentinelByNameFromChildNode,
} from '../../testUtil/index.js'

const nodeName = 'XYOPublic:NftMetadataNode'
const sentinelName = 'NftMetadataSentinel'
const indexDivinerName = 'NftMetadataIndexDiviner'
const archivistName = 'NftMetadataArchivist'

describe.skip(`${nodeName}`, () => {
  // Gutter Cats
  const uri = 'https://gutter-cats-metadata.s3.us-east-2.amazonaws.com/metadata/1347'
  let node: NodeInstance
  beforeAll(async () => {
    const bridge = await getBridge()
    const mod = await bridge.resolve(nodeName)
    node = asNodeInstance(assertEx(mod), () => 'Not a node', { required: true })
    expect(node).toBeDefined()
  })
  describe(`${sentinelName}`, () => {
    let sentinel: SentinelInstance
    beforeAll(async () => {
      sentinel = await getSentinelByNameFromChildNode(sentinelName, nodeName)
      expect(sentinel).toBeDefined()
    })
    it('queries NFT metadata URI', async () => {
      const query = { schema: 'network.xyo.api.call', uri }
      const result = await sentinel.report([query])
      expect(result).toBeArray()
      const response = result.filter(isApiCallJsonResult)
      expect(response).toBeArrayOfSize(1)
    })
  })
  describe(`${indexDivinerName}`, () => {
    let diviner: DivinerInstance
    let archivist: ArchivistInstance
    beforeAll(async () => {
      await delay(3000) // Allow enough time for index to propagate
      diviner = await getDivinerByNameFromChildNode(indexDivinerName, nodeName)
      expect(diviner).toBeDefined()
      archivist = await getArchivistByNameFromChildNode(archivistName, nodeName)
      expect(archivist).toBeDefined()
    })
    it('indexes NFT metadata by URI', async () => {
      // const query = { schema: 'network.xyo.diviner.payload.query', uri }
      const query = { schema: 'network.xyo.diviner.payload.query' }
      const results = (await diviner.divine([query])) as WithSources<{ schema: string; uri: string }>[]
      expect(results).toBeDefined()
      expect(results).toBeArrayOfSize(1)
      const result = results[0]
      expect(result.uri).toBe(uri)
      expect(result.$sources).toBeDefined()
      expect(result.$sources).toBeArray()
      expect(result.$sources?.length).toBeGreaterThan(0)
      const sources = await archivist.get(result.$sources ?? [])
      expect(sources).toBeArrayOfSize(result.$sources?.length || 0)
      const responses = filterAs(sources, asApiCallResult)
      expect(responses).toBeArrayOfSize(1)
      expect(responses[0]?.call).toBe(uri)
      expect(asApiCallJsonResult(responses[0])?.data).toBeObject()
    })
  })
})
