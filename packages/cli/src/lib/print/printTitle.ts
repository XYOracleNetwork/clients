import { newline } from './newline.js'
import { printLine } from './printLine.js'

export const printTitle = (text?: string | undefined) => {
  newline()
  printLine(text, 'yellow')
}
