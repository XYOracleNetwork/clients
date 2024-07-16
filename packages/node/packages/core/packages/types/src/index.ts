import { ARCHIVIST_TYPES } from './archivist.js'
import { DIVINER_TYPES } from './diviner.js'
import { JOB_TYPES } from './job.js'
import { MODULE_TYPES } from './module.js'
import { SENTINEL_TYPES } from './sentinel.js'
import { WITNESS_TYPES } from './witness.js'

export const TYPES = {
  ...ARCHIVIST_TYPES,
  ...DIVINER_TYPES,
  ...JOB_TYPES,
  ...MODULE_TYPES,
  ...SENTINEL_TYPES,
  ...WITNESS_TYPES,
  AccountMnemonic: 'AccountMnemonic',
  Logger: 'Logger',
  ModuleFactoryLocator: 'ModuleFactoryLocator',
}

export * from './Wallet/index.js'
