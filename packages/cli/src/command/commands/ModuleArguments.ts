import type { Address } from '@xylabs/hex'
import type { ArgumentsCamelCase } from 'yargs'

import type { BaseArguments } from '../BaseArguments.js'

export type ModuleArguments = BaseArguments
  & ArgumentsCamelCase<{
    address?: Address
    name?: string
  }>

export const isModuleArguments = (args: BaseArguments): args is ModuleArguments => {
  return !!(args?.address || args?.name)
}
