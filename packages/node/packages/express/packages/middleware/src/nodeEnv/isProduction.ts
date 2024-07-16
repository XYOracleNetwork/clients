import { NodeEnv } from './NodeEnv.js'

// TODO: Move to Express SDK
export const isProduction = () => {
  return (process.env.NODE_ENV as NodeEnv) === 'production'
}
