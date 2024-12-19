import '@xylabs/vitest-extended'

import { PayloadBuilder } from '@xyo-network/payload-builder'
import {
  describe, expect, it,
} from 'vitest'

import { reportDivinerResult } from '../reportDivinerResult.js'

describe('reportDivinerResult', () => {
  it('reports diviner results', async () => {
    const payload = new PayloadBuilder({ schema: 'network.xyo.test' }).build()
    const result = await reportDivinerResult(payload)
    expect(result).toBeArray()
  })
})
