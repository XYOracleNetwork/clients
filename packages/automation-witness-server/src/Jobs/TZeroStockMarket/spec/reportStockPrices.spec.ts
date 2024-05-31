import { reportStockPrice } from '../reportStockPrices'

describe('reportStockPrices', () => {
  describe('reportStockPrice', () => {
    it('reports stock price', async () => {
      const result = await reportStockPrice('XYLB')
      expect(result).toBeArray()
      expect(result.length).toBeGreaterThan(0)
    })
  })
})
