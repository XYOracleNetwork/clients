import type { ModuleDescriptionPayload } from '@xyo-network/module-model'
import { ModuleDescriptionSchema } from '@xyo-network/module-model'
import type { NodeInstance } from '@xyo-network/node-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { printLine, printTitle } from '../../../lib/index.js'

export const describeNode = async (node: NodeInstance) => {
  printTitle('Describe Node')
  const description = (await node.state()).find(isPayloadOfSchemaType<ModuleDescriptionPayload>(ModuleDescriptionSchema))
  printLine(JSON.stringify(description, undefined, 2))
}
