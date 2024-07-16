import { getName } from '../getName.js'

describe('getName', () => {
  it('gets the unique identifier for this worker', async () => {
    const name = await getName()
    expect(name).toBeString()
  })
})
