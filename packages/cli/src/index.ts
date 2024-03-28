import { assertEx } from '@xylabs/assert'

import { connect, printLogo, restart, setTerminalTitle, stop } from './lib'
import { startTerminal } from './terminal'

const main = async () => {
  setTerminalTitle()
  await printLogo()
  await restart()
  const connectedNodeModule = await connect()
  setTerminalTitle('XYO (Connected)')
  await startTerminal(assertEx(connectedNodeModule, () => 'Tried to connect to a remote module that was not a NodeModule'))
}

let exitStatus = 0

main()
  .then(() => {
    console.log('Finishing,...')
  })
  .catch(() => {
    console.log('Excepting,...')
    exitStatus = 1
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await stop()
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(exitStatus)
  })
