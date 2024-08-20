import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import { authRouter } from './routes'

dotenv.config()

const PORT = process.env.PORT || 3000

export const app = express()

// CORS
app.use(cors())

// body parser
app.use(express.json())

// log requests
app.use(morgan('dev'))

app.get('/', (_req, res) => {
  res.send('Hello World!')
})

app.use('/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
