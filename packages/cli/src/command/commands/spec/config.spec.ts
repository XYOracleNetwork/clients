import {
  describe, expect, it,
} from 'vitest'
import yargs from 'yargs'

import { mod } from '../config.js'

describe('config', () => {
  const parser = yargs().command(mod).help()
  it('requires arguments', async () => {
    const output = await new Promise((resolve) => {
      void parser.parse('config', (err: unknown, argv: unknown, output: unknown) => {
        resolve(output)
      })
    })
    expect(output).toContain('Not enough non-option arguments')
  })
})
