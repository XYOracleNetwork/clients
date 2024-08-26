import yargs from 'yargs'
// eslint-disable-next-line import-x/no-internal-modules
import { hideBin } from 'yargs/helpers'

import { options } from './options/index.js'

export const getOptionsParser = () => {
  const optionsParser = yargs(hideBin(process.argv))
  for (const option of options) optionsParser.option(...option)
  return optionsParser
}
