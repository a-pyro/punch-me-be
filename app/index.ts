import 'dotenv/config'

import cors from 'cors'

import express from 'express'
import morgan from 'morgan'
import { authRoutes } from './routes'

const PORT = process.env.PORT || 3000

export const app = express()

app.use(cors())

app.use(express.json())

app.use(morgan('dev'))

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Server is running on port http://localhost:${PORT}/api`)
})
