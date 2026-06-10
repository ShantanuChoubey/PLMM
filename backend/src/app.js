import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { corsOptions, env, globalRateLimiter } from './config/index.js'
import { globalErrorHandler, notFoundHandler } from './middlewares/index.js'
import routes from './routes/index.js'

const app = express()

app.set('trust proxy', 1)

app.use(helmet())
app.use(cors(corsOptions))
app.use(compression())
app.use(globalRateLimiter)

if (env.isDevelopment) {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

app.use('/api', routes)

app.use(notFoundHandler)
app.use(globalErrorHandler)

export default app
