import dotenv from 'dotenv'
import { defineConfig } from 'vitest/config'

dotenv.config()

export default defineConfig({
  test: {
    globals: true,
    reporters: ['verbose'],
    teardownTimeout: 1000,
    globalSetup: ['./packages/node/packages/express/packages/test/src/globalSetup.ts'],
    environmentMatchGlobs: [
      ['**/*.dom.spec.*', 'jsdom'], // Use jsdom
      ['**/*.node.spec.*', 'node'], // Use node
    ],
    coverage: {
      provider: 'v8', // Use V8 native coverage provider
      reporter: ['text', 'html', 'lcov'], // Output formats
      // reportsDirectory: './coverage', // Directory for coverage output
      // include: ['**/src/**/*.ts'], // Include files to track
      // exclude: ['node_modules', '**/src/*.spec.*'], // Exclude unnecessary files
    },
  },
})
