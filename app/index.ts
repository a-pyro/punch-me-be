import 'dotenv/config'

import cors from 'cors'

import express from 'express'
import morgan from 'morgan'
import { authenticateJWT } from './middlewares'
import { storesRoutes, userRoutes } from './routes'

const PORT = process.env.PORT || 3000

export const app = express()

app.use(cors())

app.use(express.json())

app.use(morgan('dev'))

app.use('/api/users', userRoutes)

app.use(authenticateJWT)

app.use('/api/stores', storesRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Server is running on port http://localhost:${PORT}/api`)
})
