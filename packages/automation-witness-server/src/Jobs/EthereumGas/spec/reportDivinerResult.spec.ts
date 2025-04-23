import '@xylabs/vitest-extended'

import { PayloadBuilder } from '@xyo-network/payload-builder'
import {
  describe, expect, it,
} from 'vitest'

import { reportDivinerResult } from '../reportDivinerResult.ts'

describe('reportDivinerResult', () => {
  it('reports diviner result', async () => {
    const payload = new PayloadBuilder({ schema: 'network.xyo.test' }).build()
    const result = await reportDivinerResult(payload)
    expect(result).toBeArray()
  })
})
