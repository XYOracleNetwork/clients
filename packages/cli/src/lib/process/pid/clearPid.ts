import { deleteFile } from '../../file/index.js'
import { pidFile } from './files.js'

export const clearPid = async () => {
  await deleteFile(pidFile)
}
