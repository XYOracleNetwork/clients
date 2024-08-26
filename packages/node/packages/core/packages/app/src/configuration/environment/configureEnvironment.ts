import type { ConfigurationFunction } from '../../model/index.js'
import { configureEnvironmentFromAWSSecret, configureEnvironmentFromDotEnv } from './providers/index.js'

export const configureEnvironment: ConfigurationFunction = async () => {
  await configureEnvironmentFromDotEnv()
  await configureEnvironmentFromAWSSecret()
}
