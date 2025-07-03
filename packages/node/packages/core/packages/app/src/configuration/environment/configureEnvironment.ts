import type { ConfigurationFunction } from '../../model/index.js'
import { configureEnvironmentFromDotEnv } from './providers/index.js'

export const configureEnvironment: ConfigurationFunction = async () => {
  await configureEnvironmentFromDotEnv()
}
