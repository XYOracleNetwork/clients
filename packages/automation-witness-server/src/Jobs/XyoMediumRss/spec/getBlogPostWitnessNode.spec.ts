import { isNodeInstance } from '@xyo-network/node-model'

import { getBlogPostWitnessNode } from '../getBlogPostWitnessNode.js'

describe('getBlogPostWitnessNode', () => {
  it('gets the node', async () => {
    const node = await getBlogPostWitnessNode()
    expect(node).toBeObject()
    expect(isNodeInstance(node)).toBeTrue()
  })
})
