import { config } from 'dotenv'
import type { Argv } from 'yargs'
import yargs from 'yargs'
// eslint-disable-next-line import-x/no-internal-modules
import { hideBin } from 'yargs/helpers'

import type { OutputType } from './command/index.js'
import { opts } from './command/index.js'

config({ quiet: true })

void yargs(hideBin(process.argv))
  .commandDir('./command/commands', opts)
  .wrap((yargs as Argv).terminalWidth())
  .demandCommand(1)
  .help()
  .alias('h', 'help')
  .boolean('verbose')
  .options({
    // TODO: Config file
    config: { config: true },
    network: {
      choices: ['local', 'kerplunk', 'main'],
      default: 'kerplunk',
      demandOption: false,
      describe: 'Known network to target.',
      type: 'string',
    },
  })
  .option('output', {
    alias: 'o',
    choices: ['json', 'raw'] as OutputType[],
    default: 'json',
    demandOption: true,
    describe: 'Output format',
  })
  .version()
  .parse()
