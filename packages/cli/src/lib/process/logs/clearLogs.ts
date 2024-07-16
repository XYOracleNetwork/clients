import { clearErrFile } from './err/index.js'
import { clearOutFile } from './out/index.js'

export const clearLogs = async () => {
  await clearOutFile()
  await clearErrFile()
}
