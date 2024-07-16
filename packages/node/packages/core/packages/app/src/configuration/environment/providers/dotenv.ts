import { config } from 'dotenv'

import { ConfigurationFunction } from '../../../model/index.js'

export const configureEnvironmentFromDotEnv: ConfigurationFunction = () => {
  config()
}
