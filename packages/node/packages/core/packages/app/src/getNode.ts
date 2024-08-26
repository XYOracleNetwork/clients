import { HDWallet } from '@xyo-network/account'
import type { AccountInstance } from '@xyo-network/account-model'
import { WALLET_PATHS } from '@xyo-network/node-core-types'
import type { MemoryNodeParams } from '@xyo-network/node-memory'
import { MemoryNode } from '@xyo-network/node-memory'
import { NodeConfigSchema } from '@xyo-network/node-model'
import { PayloadValidator } from '@xyo-network/payload-validator'
import { SchemaNameValidator } from '@xyo-network/schema-name-validator'

import { configureEnvironment, configureTransports } from './configuration/index.js'

const name = 'XYOPublic'
const config = { name, schema: NodeConfigSchema }

export const getNode = async (account?: AccountInstance): Promise<MemoryNode> => {
  await configureEnvironment()
  if (!account) {
    const mnemonic = process.env.MNEMONIC || ''
    const path = WALLET_PATHS.Nodes.Node
    account = await HDWallet.fromPhrase(mnemonic, path)
  }
  PayloadValidator.setSchemaNameValidatorFactory((schema: string) => new SchemaNameValidator(schema))
  const params: MemoryNodeParams = { account, config }
  const node = await MemoryNode.create(params)
  await configureTransports(node)
  return node
}
