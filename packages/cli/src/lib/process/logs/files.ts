import { tmpdir } from 'node:os'
import { join } from 'node:path'

/**
 * File used for process stdout
 */
export const outFile = join(tmpdir(), 'xyo.stdout.txt')

/**
 * File used for process stderr
 */
export const errFile = join(tmpdir(), 'xyo.stderr.txt')
