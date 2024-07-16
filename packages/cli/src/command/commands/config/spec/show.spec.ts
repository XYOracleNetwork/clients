import yargs from 'yargs'

import { mod } from '../show.js'

describe('config show', () => {
  it('shows the XYO config', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
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
