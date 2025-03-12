import type {
  PayloadAddressRule,
  PayloadRule, PayloadSchemaRule,
} from '@xyo-network/node-core-model'
import {
  describe, expect, it, vi,
} from 'vitest'

import { combineRules } from '../combineRules.js'

// Mock Date.now
const now = new Date()
vi.useFakeTimers().setSystemTime(now)

const validRules = (): PayloadRule[][] => {
  return [[{ schema: 'network.xyo.debug' }], [{ order: 'desc' }]]
}

describe('combineRules', () => {
  describe('with no rules', () => {
    it('should throw', () => {
      expect(() => {
        combineRules([])
      }).toThrow()
    })
    it('for addresses defaults to an empty array', () => {
      const rules = validRules()
      const actual = combineRules(rules)
      expect(actual.addresses.length).toBe(0)
    })
    it('for schema should throw', () => {
      expect(() => {
        const rules = validRules().filter(rule => !(rule?.[0] as PayloadSchemaRule)?.schema)
        combineRules(rules)
      }).toThrow()
    })
  })
  describe('with PayloadAddressRule rules', () => {
    it('combines multiple rules', () => {
      const rules = validRules()
      const addressRules: PayloadAddressRule[] = [{ address: 'foo' }, { address: 'bar' }]
      rules.push(addressRules)
      const actual = combineRules(rules)
      // eslint-disable-next-line sonarjs/no-alphabetical-sort
      expect(actual.addresses.toSorted()).toEqual(['bar', 'foo'])
    })
  })
  describe('with PayloadSchemaRule rules', () => {
    it('combines multiple rules', () => {
      const rules: PayloadRule[][] = [[{ order: 'desc' }], [{ schema: 'network.xyo.test' }, { schema: 'network.xyo.debug' }]]
      const actual = combineRules(rules)
      // eslint-disable-next-line sonarjs/no-alphabetical-sort
      expect(actual.schemas.toSorted()).toEqual(['network.xyo.debug', 'network.xyo.test'])
    })
  })
  describe('with PayloadTimestampDirectionRule rules', () => {
    it('should only allow one rule', () => {
      const rules: PayloadRule[][] = [
        [{ schema: 'network.xyo.debug' }],
        [
          { order: 'desc' },
          { order: 'asc' },
        ],
      ]
      expect(() => {
        combineRules(rules)
      }).toThrow()
    })
  })
})
