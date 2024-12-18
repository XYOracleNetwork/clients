import {
  describe, expect, it,
  vi,
} from 'vitest'
import yargs from 'yargs'

import { mod } from '../show.js'

describe('config show', () => {
  it('shows the XYO config', async () => {
    const consoleSpy = vi.spyOn(console, 'log')
    const parser = yargs().command(mod).help()
    await new Promise((resolve) => {
      void parser.parse('show', (err: unknown, argv: unknown, output: unknown) => {
        resolve(output)
      })
    })
    // Shows XYO config
    expect(consoleSpy).toHaveBeenCalledWith('{"schema":"network.xyo.module.config"}')
  })
})
