import { readJson } from '../file/index.js'
import { settingsFile } from './files.js'
import type { Settings } from './Settings.js'

export const loadSettings = (): Promise<Settings | undefined> => {
  return readJson<Settings>(settingsFile)
}
