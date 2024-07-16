import { printLine } from './printLine.js'

export const printError = (text?: string | undefined) => {
  printLine(text, 'red')
}
