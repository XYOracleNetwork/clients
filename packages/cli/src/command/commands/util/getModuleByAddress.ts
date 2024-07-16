import { Address } from '@xylabs/hex'
import { Module } from '@xyo-network/module-model'

import { BaseArguments } from '../../BaseArguments.js'
import { getModuleFromModuleFilter } from './getModuleFromModuleFilter.js'

export const getModuleByAddress = (args: BaseArguments, address: Address): Promise<Module> => getModuleFromModuleFilter(args, { address: [address] })
