import { writeJson } from '../file/index.js'
import { settingsFile } from './files.js'
import { Settings } from './Settings.js'

export const saveSettings = async (settings: Settings): Promise<void> => {
  await writeJson(settingsFile, settings)
}
