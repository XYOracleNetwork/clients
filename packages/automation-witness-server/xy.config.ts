import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    entryMode: 'custom',
    browser: {},
    neutral: {},
    node: { src: { entry: ['./index.ts', './launchServer.ts'] } },
  },
}

export default config
