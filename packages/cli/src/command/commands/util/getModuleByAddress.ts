import { Address } from '@xylabs/hex'
import { Module } from '@xyo-network/module-model'

import { BaseArguments } from '../../BaseArguments'
import { getModuleFromModuleFilter } from './getModuleFromModuleFilter'

export const getModuleByAddress = (args: BaseArguments, address: Address): Promise<Module> => getModuleFromModuleFilter(args, { address: [address] })
