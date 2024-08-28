import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { STATUS_CODES } from '../utils'
import { env } from '../utils/env'

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(STATUS_CODES.FORBIDDEN).json({ message: 'Forbidden' })
      }
      req.user = user
      next()
    })
  } else {
    res.status(STATUS_CODES.UNAUTHORIZED).json({ message: 'Unauthorized' })
  }
}
