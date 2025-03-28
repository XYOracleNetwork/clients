import { tryParseInt } from '@xylabs/express'
import { config } from 'dotenv'

import { server } from './Server/index.js'

config()

void server(tryParseInt(process.env.APP_PORT))
