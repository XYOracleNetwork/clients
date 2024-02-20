import { Address } from '@xylabs/hex'
import { ArgumentsCamelCase } from 'yargs'

import { BaseArguments } from '../BaseArguments'

export type ModuleArguments = BaseArguments &
  ArgumentsCamelCase<{
    address?: Address
    name?: string
  }>

export const isModuleArguments = (args: BaseArguments): args is ModuleArguments => {
  return !!(args?.address || args?.name)
}
