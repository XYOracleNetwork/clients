import { getNode } from '../getNode.js'

describe.skip('getNode', () => {
  it('returns a node', async () => {
    const node = await getNode()
    expect(node).toBeObject()
  })
})
