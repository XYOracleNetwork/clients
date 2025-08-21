import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import type { Logger, LoggerVerbosity } from '@xylabs/express'
import { getLogger } from '@xylabs/express'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { addMongoModules, canAddMongoModules } from '@xyo-network/node-core-modules-mongo'
import { TYPES } from '@xyo-network/node-core-types'
import type { NodeInstance } from '@xyo-network/node-model'
import { config } from 'dotenv'
import type { interfaces } from 'inversify'
import { Container } from 'inversify'

import { configureMemoryNode } from './configureMemoryNode.js'
import { addMemoryModules } from './Module/index.js'
// import { tryGetServiceName } from './Util/index.js'
config({ quiet: true })

export const container = new Container({
  autoBindInjectable: true,
  // Set to true to prevent warning when child constructor has less
  // parameters than the parent
  // "The number of constructor arguments in the derived
  // class <ClassName> must be >= than the number of constructor
  // arguments of its base class."
  // See:
  // https://github.com/inversify/InversifyJS/issues/522#issuecomment-682246076
  skipBaseClassChecks: true,
})

let configured = false

export const configureDependencies = async (node?: NodeInstance) => {
  if (configured) return
  configured = true

  const mnemonic = assertEx(process.env.MNEMONIC, () => 'MNEMONIC ENV VAR required to create Archivist')
  const verbosity: LoggerVerbosity = ((process.env.VERBOSITY as LoggerVerbosity) ?? process.env.NODE_ENV === 'test') ? 'error' : 'info'
  const logger = getLogger(verbosity)

  container.bind<string>(TYPES.AccountMnemonic).toConstantValue(mnemonic)
  container.bind<ModuleFactoryLocator>(TYPES.ModuleFactoryLocator).toConstantValue(new ModuleFactoryLocator())

  container.bind<Logger>(TYPES.Logger).toDynamicValue((_context: interfaces.Context) => {
    // const service = tryGetServiceName(context)
    // TODO: Configure logger with service name
    // const defaultMeta = { service }
    // const config = { defaultMeta }
    return logger
  })
  addMemoryModules(container)
  if (canAddMongoModules()) await addMongoModules(container)
  await configureMemoryNode(container, node)
}
