import { Options } from 'yargs'

import { daemon } from './daemon.js'
import { mod } from './mod.js'
import { verbose } from './verbose.js'

export const options: [string, Options][] = [daemon, mod, verbose]
