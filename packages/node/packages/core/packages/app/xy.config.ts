import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: {},
    neutral: {},
    entryMode: 'custom',
    node: { src: { entry: ['index.ts', 'app.ts'] } },
  },
}

export default config
