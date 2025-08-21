import { tryParseInt } from '@xylabs/express'
import { config } from 'dotenv'

import { server } from './Server/index.js'

config({ quiet: true })

void server(tryParseInt(process.env.APP_PORT))
