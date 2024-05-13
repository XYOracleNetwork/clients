import { homedir } from 'node:os'
import Path from 'node:path'

const fileName = '.xyo'

/**
 * The file path where the settings information is stored
 */
export const settingsFile = Path.join(homedir(), fileName)
