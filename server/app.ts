import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './src/config/env.js'
import routes from './src/routes/index.js'
import { apiLimiter } from './src/middleware/rateLimit.middleware.js'
import { errorHandler, notFoundHandler } from './src/middleware/error.middleware.js'

const app: Express = express()

app.use(helmet())
app.use(cors({ origin: env.corsOrigin, credentials: true }))
app.use(express.json({ limit: '10kb' }))
app.use(morgan(env.isDev ? 'dev' : 'combined'))
app.use('/api', apiLimiter)

app.get('/health', (_req, res) => res.json({ status: 'ok', env: env.nodeEnv }))

app.use('/api', routes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
