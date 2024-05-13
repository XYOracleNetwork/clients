import { tmpdir } from 'node:os'
import Path from 'node:path'

/**
 * File used for process stdout
 */
export const outFile = Path.join(tmpdir(), 'xyo.stdout.txt')

/**
 * File used for process stderr
 */
export const errFile = Path.join(tmpdir(), 'xyo.stderr.txt')
