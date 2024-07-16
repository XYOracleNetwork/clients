import { ModuleDescriptionPayload, ModuleDescriptionSchema } from '@xyo-network/module-model'
import { NodeInstance } from '@xyo-network/node-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { printLine, printTitle } from '../../../lib/index.js'

export const describeNode = async (node: NodeInstance) => {
  printTitle('Describe Node')
  const description = (await node.state()).find<ModuleDescriptionPayload>(isPayloadOfSchemaType(ModuleDescriptionSchema))
  printLine(JSON.stringify(description, undefined, 2))
}
