import bcrypt from 'bcrypt'
import { Response } from 'express'
import { logger, signToken } from '../../../utils'
import { ApiResquest, COLLECTIONS, supabase } from '../../database'

export const loginUser = async (
  req: ApiResquest<{ email: string; password: string }>,
  res: Response,
) => {
  logger.info(`Received login request: ${JSON.stringify(req.body)}`)
  const { email, password } = req.body

  // Find the user by email
  const { data: user, error: userError } = await supabase
    .from(COLLECTIONS.users)
    .select('*')
    .eq('email', email)
    .single()

  if (userError) {
    logger.error(`Error finding user: ${JSON.stringify(userError)}`)
    return res.status(500).json({ message: 'Error finding user' })
  }

  if (!user) {
    logger.warn(`Invalid email or password for email: ${email}`)
    return res.status(400).json({ message: 'Invalid email or password' })
  }

  // Check if the password is correct
  logger.info(`Checking password for user: ${email}`)
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    logger.warn(`Invalid password for email: ${email}`)
    return res.status(400).json({ message: 'Invalid email or password' })
  }

  const token = signToken(user)

  res.status(200).json({ token, data: user })
}
