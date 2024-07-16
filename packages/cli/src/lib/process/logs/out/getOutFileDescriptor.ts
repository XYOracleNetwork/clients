import { openSync } from 'node:fs'

import { outFile } from '../files.js'

export const getOutFileDescriptor = () => {
  return openSync(outFile, 'a+')
}
