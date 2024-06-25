import yargs from 'yargs'

import { hideBin } from 'yargs/helpers'

import { options } from './options'

export const getOptionsParser = () => {
  const optionsParser = yargs(hideBin(process.argv))
  for (const option of options) optionsParser.option(...option)
  return optionsParser
}
