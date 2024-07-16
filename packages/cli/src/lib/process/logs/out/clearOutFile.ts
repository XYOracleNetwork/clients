import { deleteFile } from '../../../file/index.js'
import { outFile } from '../files.js'

export const clearOutFile = () => {
  return deleteFile(outFile)
}
