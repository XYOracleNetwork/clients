import { terminal } from 'terminal-kit'

import { printLine } from '../lib/index.js'

export const stopTerminal = () => {
  terminal.grabInput(false)
  terminal.clear()
  printLine('XYO Node Shutdown - Bye', 'green')
  // eslint-disable-next-line unicorn/no-process-exit
  setTimeout(() => process.exit(), 100)
}
