import { saveSettings } from '../saveSettings.js'
import { Settings } from '../Settings.js'

export const saveMnemonic = async (mnemonic: string): Promise<void> => {
  const data: Settings = { account: { mnemonic } }
  await saveSettings(data)
}
