import { NodeEnv } from './NodeEnv.js'

// TODO: Move to Express SDK
export const isDevelopment = () => {
  return (process.env.NODE_ENV as NodeEnv) === 'development'
}
