import { exists } from '@xylabs/exists'
import type { Address } from '@xylabs/hex'
import type { EmptyObject } from '@xylabs/object'
import type { ModuleDescriptionPayload } from '@xyo-network/module-model'
import { ModuleDescriptionSchema } from '@xyo-network/module-model'
import type { NodeInstance } from '@xyo-network/node-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import type { CommandBuilder, CommandModule } from 'yargs'

import { printError, printLine } from '../../../../lib/index.js'
import type { BaseArguments } from '../../../BaseArguments.js'
import { getNode } from '../../../util/index.js'

export const aliases: ReadonlyArray<string> = []
export const builder: CommandBuilder = {}
export const command = 'children'
export const deprecated = false
export const describe = 'Describe the children of the XYO Node'
export const handler = async (argv: BaseArguments) => {
  const { verbose } = argv
  try {
    const node: NodeInstance = await getNode(argv)
    const description = (await node.state()).find(isPayloadOfSchemaType<ModuleDescriptionPayload>(ModuleDescriptionSchema))
    const childAddresses = (description?.children || []) as Address[]
    const children = (await Promise.all(childAddresses?.map(child => node.resolve(child, { direction: 'down' })))).filter(exists)
    const childDescriptions = await Promise.all(
      children.flat().map(async mod => (await mod.state()).find(isPayloadOfSchemaType<ModuleDescriptionPayload>(ModuleDescriptionSchema))),
    )
    printLine(JSON.stringify(childDescriptions))
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Error Querying Node')
  }
}

const mod: CommandModule<EmptyObject, BaseArguments> = {
  aliases,
  command,
  deprecated,
  describe,
  handler,
}

export default mod
