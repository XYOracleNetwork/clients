import { stat, writeFile } from 'node:fs/promises'

import { merge } from './merge.ts'
import { readJson } from './readJson.js'

export const writeJson = async (file: string, data: object): Promise<object | undefined> => {
  let previous: object = {}
  try {
    if ((await stat(file)).isFile()) {
      const existing = await readJson<object>(file)
      if (existing) previous = existing
    }
  } catch {
    // File doesn't exist or is corrupt
  }
  data = merge(previous, data)
  await writeFile(file, JSON.stringify(data), { encoding: 'utf8' })
  return data
}
