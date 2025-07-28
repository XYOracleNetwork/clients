import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: {},
    neutral: {},
    entryMode: 'all',
    node: { src: true },
  },
}

export default config
