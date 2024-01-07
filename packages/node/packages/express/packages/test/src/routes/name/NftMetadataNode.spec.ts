import { delay } from '@xylabs/delay'
import { Bridge } from '@xyo-network/bridge-model'
import { DivinerInstance } from '@xyo-network/diviner-model'
import { Payload } from '@xyo-network/payload-model'
import { SentinelInstance } from '@xyo-network/sentinel-model'

import { getBridgeToChildNode, getDivinerByNameFromChildNode, getSentinelByNameFromChildNode } from '../../testUtil'

const nodeName = 'NftMetadataNode'
const sentinelName = 'NftMetadataSentinel'
const indexDivinerName = 'NftMetadataIndexDiviner'

describe(`${nodeName}`, () => {
  let bridge: Bridge
  beforeAll(async () => {
    bridge = await getBridgeToChildNode(nodeName)
    expect(bridge).toBeDefined()
  })
  describe(`${sentinelName}`, () => {
    let sentinel: SentinelInstance
    beforeAll(async () => {
      sentinel = await getSentinelByNameFromChildNode(sentinelName, nodeName)
      expect(sentinel).toBeDefined()
    })
    it('queries NFT metadata URI', async () => {
      const query = {
        schema: 'network.xyo.api.call',
        // Gutter Cats
        uri: 'https://gutter-cats-metadata.s3.us-east-2.amazonaws.com/metadata/1347',
      } as Payload
      const result = await sentinel.report([query])
      expect(result).toBeArray()
      const response = result.filter((p) => p.schema === 'network.xyo.api.call.result')
      expect(response).toBeArrayOfSize(1)
    })
  })
  describe(`${indexDivinerName}`, () => {
    let diviner: DivinerInstance
    beforeAll(async () => {
      await delay(300) // Allow enough time for index to propagate
      diviner = await getDivinerByNameFromChildNode(indexDivinerName, nodeName)
      expect(diviner).toBeDefined()
    })
    it('queries NFT metadata URI', async () => {
      const query = {
        schema: 'network.xyo.diviner.payload.query',
        uri: 'https://gutter-cats-metadata.s3.us-east-2.amazonaws.com/metadata/1347',
      }
      const result = (await diviner.divine([query])) as unknown as Payload<{ address?: string; chainId?: number; tokenId?: string }>[]
      expect(result).toBeDefined()
      expect(result).toBeArrayOfSize(1)
    })
  })
})
