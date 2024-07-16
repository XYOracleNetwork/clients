import { readFile, stat } from 'node:fs/promises'

import { pidFile } from './files.js'

const encoding = 'utf8'

export const getPid = async (): Promise<number | undefined> => {
  try {
    const exists = (await stat(pidFile)).isFile()
    if (exists) {
      const data = await readFile(pidFile, { encoding })
      const pid = Number.parseInt(data)
      if (pid) return pid
    }
  } catch {
    // stat can throw if file doesn't exist
  }
  return undefined
}
