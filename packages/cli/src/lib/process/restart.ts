import { clearLogs } from './logs/index.js'
import { start } from './start.js'
import { stop } from './stop.js'

export const restart = async (daemonize = false) => {
  await stop()
  await clearLogs()
  return start(daemonize)
}
