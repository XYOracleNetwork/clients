import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { getTask } from '../getTask.ts'

describe('getTask', () => {
  it('gets the job', () => {
    const task = getTask()
    expect(task).toBeFunction()
  })
})
