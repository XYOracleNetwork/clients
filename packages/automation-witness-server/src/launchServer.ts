import { config } from 'dotenv'
import z from 'zod'

import { server } from './Server/index.js'

config({ quiet: true })

void server(z.number().int().safeParse(process.env.APP_PORT).data)
