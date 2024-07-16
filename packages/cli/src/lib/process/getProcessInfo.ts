import { isRunning } from './isRunning.js'
import { errFile, outFile } from './logs/index.js'
import { getPid } from './pid/index.js'

export interface NodeInfo {
  logs: {
    stderr: string
    stdout: string
  }
  pid?: number
}

const logs = {
  stderr: errFile,
  stdout: outFile,
}

export const getProcessInfo = async (): Promise<NodeInfo | undefined> => {
  if (await isRunning()) {
    const pid = await getPid()
    if (pid) {
      return { logs, pid }
    }
  }
  return { logs }
}
