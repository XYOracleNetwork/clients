import { writeFile } from 'node:fs/promises'

import { pidFile } from './files.js'

export const setPid = async (pid: number | undefined) => {
  if (pid) {
    await writeFile(pidFile, `${pid}`)
  }
}
