import session from 'express-session'
import { env } from '../utils'

export const sessionMiddleware = session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
})
