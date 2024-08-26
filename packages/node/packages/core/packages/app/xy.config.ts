import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: {},
    node: { src: { entry: ['src/index.ts', 'src/app.ts'] } },
  },
}

export default config
