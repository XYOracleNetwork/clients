import { config } from 'dotenv'

import type { ConfigurationFunction } from '../../../model/index.js'

export const configureEnvironmentFromDotEnv: ConfigurationFunction = () => {
  config()
}
