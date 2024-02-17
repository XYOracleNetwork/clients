import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * The file to use to ensure singleton process
 */
export const pidFile = join(tmpdir(), 'xyo.pid')
