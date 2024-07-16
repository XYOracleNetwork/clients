import { deleteFile } from '../../../file/index.js'
import { errFile } from '../files.js'

export const clearErrFile = () => {
  return deleteFile(errFile)
}
