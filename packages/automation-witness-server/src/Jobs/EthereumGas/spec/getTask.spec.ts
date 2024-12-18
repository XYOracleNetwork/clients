import {
  describe, expect, it,
} from 'vitest'

import { getTask } from '../getTask.js'

describe('getTask', () => {
  it('gets the job', () => {
    const task = getTask()
    expect(task).toBeFunction()
  })
})
