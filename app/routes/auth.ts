import { Router } from 'express'
import { passport } from '../utils/passport'

const authRoutes = Router()

authRoutes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
)

authRoutes.get(
  '/google/callback',
  passport.authenticate('google', {
    accessType: 'offline',
    scope: ['email', 'profile'],
  }),
  (req, res) => {
    if (!req.user) {
      res.status(400).json({ error: 'Authentication failed' })
    }
    // return user details
    res.status(200).json(req.user)
  },
)

export { authRoutes }
