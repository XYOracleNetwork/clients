import { isNodeInstance } from '@xyo-network/node-model'

import { getNode } from '../getNode.js'

describe('getNode', () => {
  it('gets the node', async () => {
    const node = await getNode()
    expect(node).toBeObject()
    expect(isNodeInstance(node)).toBeTrue()
  })
})
