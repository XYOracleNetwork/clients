import { getEnvFromAws } from '@xylabs/express'

import type { ConfigurationFunction } from '../../../model/index.js'

export const configureEnvironmentFromAWSSecret: ConfigurationFunction = async () => {
  // If an AWS ARN was supplied for Secrets Manager
  const awsEnvSecret = process.env.AWS_ENV_SECRET_ARN
  if (awsEnvSecret) {
    // Merge the values from AWS into the current ENV
    // with AWS taking precedence
    const awsEnv = await getEnvFromAws(awsEnvSecret)
    Object.assign(process.env, awsEnv)
  }
}
