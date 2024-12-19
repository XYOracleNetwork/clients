import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { getName } from '../getName.js'

describe('getName', () => {
  it('gets the unique identifier for this worker', () => {
    const name = getName()
    expect(name).toBeString()
  })
})
