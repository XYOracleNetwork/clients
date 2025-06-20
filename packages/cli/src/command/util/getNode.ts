import type { NodeInstance } from '@xyo-network/node-model'
import { asNodeInstance } from '@xyo-network/node-model'

import { printError } from '../../lib/index.js'
import type { BaseArguments } from '../BaseArguments.js'
// import { getBridge } from './getBridge.js'

export const getNode = async (args: BaseArguments): Promise<NodeInstance> => {
  const { verbose } = args
  try {
    // const bridge = await getBridge(args)
    // eslint-disable-next-line unicorn/no-useless-undefined
    const node = await Promise.resolve(undefined)
    // assertEx((await bridge.resolve({ address: [await bridge.getRootAddress()] }))?.pop(), 'Failed to resolve rootNode')
    return asNodeInstance(node, 'Not a NodeModule', { required: true })
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Unable to connect to XYO Node')
  }
}
