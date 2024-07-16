import { NodeEnv } from './NodeEnv.js'

// TODO: Move to Express SDK
export const isTest = () => {
  return (process.env.NODE_ENV as NodeEnv) === 'test'
}
