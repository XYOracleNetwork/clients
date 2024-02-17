import { openSync } from 'node:fs'

import { errFile } from '../files'

export const getErrFileDescriptor = () => {
  return openSync(errFile, 'a+')
}
