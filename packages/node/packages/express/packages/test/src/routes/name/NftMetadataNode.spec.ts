import { Bridge } from '@xyo-network/bridge-model'
import { Payload } from '@xyo-network/payload-model'
import { SentinelInstance } from '@xyo-network/sentinel-model'

import { getBridgeToChildNode, getSentinelByNameFromChildNode } from '../../testUtil'

const nodeName = 'NftMetadataNode'
const sentinelName = 'NftMetadataSentinel'

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
})
