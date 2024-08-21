import 'dotenv/config'

import cors from 'cors'

import express from 'express'
import morgan from 'morgan'
import { sessionMiddleware } from './middlewares'
import { authRoutes } from './routes'
import { passport } from './utils'

const PORT = process.env.PORT || 3000

export const app = express()

app.use(cors())

app.use(express.json())

app.use(sessionMiddleware)

app.use(morgan('dev'))

app.use(passport.initialize())

app.use(passport.session())

app.get('/api', ({ isAuthenticated }, res) => {
  if (isAuthenticated()) {
    return res.send('Hello World! You are authenticated')
  }
  res.status(401).send('Hello World! You are not authenticated')
})

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Server is running on port http://localhost:${PORT}/api`)
})
