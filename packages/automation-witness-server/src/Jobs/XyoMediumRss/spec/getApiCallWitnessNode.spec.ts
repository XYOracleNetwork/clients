import { isNodeInstance } from '@xyo-network/node-model'

import { getApiCallWitnessNode } from '../getApiCallWitnessNode'

describe('getApiCallWitnessNode', () => {
  it('gets the node', async () => {
    const node = await getApiCallWitnessNode()
    expect(node).toBeObject()
    expect(isNodeInstance(node)).toBeTrue()
  })
})
