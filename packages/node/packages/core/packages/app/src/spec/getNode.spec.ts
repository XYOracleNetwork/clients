import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { getNode } from '../getNode.js'

describe.skip('getNode', () => {
  it('returns a node', async () => {
    const node = await getNode()
    expect(node).toBeObject()
  })
})
