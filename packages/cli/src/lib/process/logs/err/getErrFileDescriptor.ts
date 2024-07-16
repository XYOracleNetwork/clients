import { openSync } from 'node:fs'

import { errFile } from '../files.js'

export const getErrFileDescriptor = () => {
  return openSync(errFile, 'a+')
}
