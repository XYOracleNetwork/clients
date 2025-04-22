import '@xylabs/vitest-extended'

import { isNodeInstance } from '@xyo-network/node-model'
import {
  describe, expect, it,
} from 'vitest'

import { getNode } from '../getNode.ts'

describe('getNode', () => {
  it('gets the node', async () => {
    const node = await getNode()
    expect(node).toBeObject()
    expect(isNodeInstance(node)).toBeTrue()
  })
})
