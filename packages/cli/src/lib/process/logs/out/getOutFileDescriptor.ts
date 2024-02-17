import { openSync } from 'node:fs'

import { outFile } from '../files'

export const getOutFileDescriptor = () => {
  return openSync(outFile, 'a+')
}
