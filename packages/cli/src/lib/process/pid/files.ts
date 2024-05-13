import { tmpdir } from 'node:os'
import Path from 'node:path'

/**
 * The file to use to ensure singleton process
 */
export const pidFile = Path.join(tmpdir(), 'xyo.pid')
