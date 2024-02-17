import { homedir } from 'node:os'
import { join } from 'node:path'

const fileName = '.xyo'

/**
 * The file path where the settings information is stored
 */
export const settingsFile = join(homedir(), fileName)
