import Path from 'node:path'

import type { RequireDirectoryOptions } from 'yargs'

/**
 * The extension of this file. Used to detect if running
 * via TS or transpiled output.
 */
const thisFileExtension = Path.extname(__filename).replace('.', '')

/**
 * Used with array.filter to remove duplicate array elements
 * @param value The current value
 * @param index The index of the current value
 * @param array The array
 * @returns
 */
const unique = (value: string, index: number, array: string[]) => array.indexOf(value) === index

export const exclude = new RegExp('.spec.ts')
export const extensions = [thisFileExtension, 'js'].filter(unique)

export const opts: RequireDirectoryOptions = { exclude, extensions }
