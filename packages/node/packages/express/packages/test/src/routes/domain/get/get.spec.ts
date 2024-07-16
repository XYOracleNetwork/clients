import { getDomain } from '../../../testUtil/index.js'

const domain = 'network.xyo'

describe('/domain', () => {
  describe('when unauthorized returns', () => {
    it('retrieve network.xyo', async () => {
      const response = await getDomain(domain)
      expect(response.aliases?.['network.xyo.schema']).toBeDefined()
    })
  })
})
