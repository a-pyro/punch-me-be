import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import { COLLECTIONS } from './database'
import { authenticateJWT } from './middlewares/authenticate-jwt'
import { punchcardsRoutes } from './punchcards/routes'
import { storesRoutes } from './stores/routes'
import { userRoutes } from './users/routes'

const PORT = process.env.PORT || 3000

export const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Create a base router for /api
const router = express.Router()

// Define routes within the base router
router.use(`/${COLLECTIONS.users}`, userRoutes)
router.use(authenticateJWT)
router.use(`/${COLLECTIONS.stores}`, storesRoutes)
router.use(`/${COLLECTIONS.punchcards}`, punchcardsRoutes)

// Mount the base router to the app
app.use('/api', router)

// Not Found handler
app.use((_req, res, _next) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Server is running on port http://localhost:${PORT}/api`)
})
