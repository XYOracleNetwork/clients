import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: {},
    neutral: {},
    entryMode: 'all',
    node: { src: { entry: ['src/**/*.ts', '!src/**/*.spec.*'] } },
  },
}

export default config
