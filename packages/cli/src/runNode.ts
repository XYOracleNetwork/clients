import { getNode } from '@xyo-network/node-app'

import { getAccount } from './lib/index.js'

const main = async () => {
  const account = await getAccount()
  return getNode(account)
}

void main()
