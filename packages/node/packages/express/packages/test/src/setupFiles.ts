import { ForgetPromise } from '@xylabs/forget'
import { afterAll, beforeAll } from 'vitest'

beforeAll(() => {
  // Can be async, before each test file
})

afterAll(async () => {
  // Can be async, after each test file
  await ForgetPromise.awaitInactive()
})
