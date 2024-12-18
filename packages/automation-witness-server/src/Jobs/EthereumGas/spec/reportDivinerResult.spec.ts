import { PayloadBuilder } from '@xyo-network/payload-builder'
import {
  describe, expect, it,
} from 'vitest'

import { reportDivinerResult } from '../reportDivinerResult.js'

describe('reportDivinerResult', () => {
  it('reports diviner result', async () => {
    const payload = await new PayloadBuilder({ schema: 'network.xyo.test' }).build()
    const result = await reportDivinerResult(payload)
    expect(result).toBeArray()
  })
})
