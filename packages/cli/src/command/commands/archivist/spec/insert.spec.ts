import {
  describe, expect, it,
} from 'vitest'
import yargs from 'yargs'

import insert from '../insert.js'

describe('insert', () => {
  const parser = yargs().command(insert).help()
  it('requires arguments', async () => {
    const output = await new Promise((resolve) => {
      void parser.parse('insert', (err: unknown, argv: unknown, output: unknown) => {
        resolve(output)
      })
    })
    expect(output).toContain('Not enough non-option arguments')
  })
})
