import type { Address } from '@xylabs/hex'
import type { Module } from '@xyo-network/module-model'

import type { BaseArguments } from '../../BaseArguments.js'
import { getModuleFromModuleFilter } from './getModuleFromModuleFilter.js'

export const getModuleByAddress = (args: BaseArguments, address: Address): Promise<Module> => getModuleFromModuleFilter(args, { address: [address] })
