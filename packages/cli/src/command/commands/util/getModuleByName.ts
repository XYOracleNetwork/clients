import type { Module } from '@xyo-network/module-model'

import type { BaseArguments } from '../../BaseArguments.js'
import { getModuleFromModuleFilter } from './getModuleFromModuleFilter.js'

export const getModuleByName = (args: BaseArguments, name: string): Promise<Module> => getModuleFromModuleFilter(args, { name: [name] })
