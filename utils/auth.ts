import jwt from 'jsonwebtoken'
import { User } from '../app/database/types'
import { env } from './env'

export const signToken = ({ id: userId, email, display_name }: User) =>
  jwt.sign(
    {
      userId,
      email,
      display_name,
    },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )
