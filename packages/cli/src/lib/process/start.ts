import { spawn } from 'node:child_process'
import Path from 'node:path'

import { getErrFileDescriptor, getOutFileDescriptor } from './logs'
import { setPid } from './pid'

/**
 * The path to the script to run the Node
 */
const runNodeScriptPath =
  Path.parse(__filename).ext.includes('ts') ?
    Path.join(__dirname, '..', '..', '..', 'dist', 'cjs', 'runNode.js')
  : Path.join(__dirname, '..', '..', '..', 'cjs', 'runNode.js')

/**
 * Runs the XYO Node process
 * @param bin The process to run
 * @param args The arguments to pass to the process
 * @returns The process ID of the Node
 */
export const start = async (daemonize = false, bin = 'node', args: ReadonlyArray<string> = [runNodeScriptPath]) => {
  // NOTE: Sync FD here because async warns about closing
  // when we background process as daemon
  const out = getOutFileDescriptor()
  const err = getErrFileDescriptor()

  // Create node via process
  const proc = spawn(bin, args, {
    detached: true,
    env: process.env,
    stdio: ['ignore', out, err],
  })
  const { pid } = proc
  await setPid(pid)
  if (daemonize) {
    proc.unref()
  }
}
