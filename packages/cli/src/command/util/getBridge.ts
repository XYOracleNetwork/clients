import type { WalletInstance } from '@xyo-network/account'
import { HDWallet } from '@xyo-network/account'
import type { HttpBridgeParams } from '@xyo-network/bridge-http'
import { HttpBridge } from '@xyo-network/bridge-http'

import { printError } from '../../lib/index.js'
import type { BaseArguments } from '../BaseArguments.js'
import { getBridgeConfig } from './getBridgeConfig.js'

// TODO: Grab from config, rethink default path, use hardened path?
const accountPath = "m/44'/60'/0"
let wallet: WalletInstance | undefined

export const getBridge = async (args: BaseArguments): Promise<HttpBridge<HttpBridgeParams>> => {
  const { verbose } = args
  try {
    if (!wallet) {
      const mnemonic = process.env.MNEMONIC
      wallet = mnemonic ? await HDWallet.fromPhrase(mnemonic) : await HDWallet.random()
    }
    const config = await getBridgeConfig(args)
    const bridge = await HttpBridge.create({ account: await wallet.derivePath(accountPath), config })
    await bridge.start()
    return bridge
  } catch (error) {
    if (verbose) printError(JSON.stringify(error))
    throw new Error('Unable to obtain bridge')
  }
}
