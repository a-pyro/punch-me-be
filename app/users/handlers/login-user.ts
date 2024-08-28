import {
  logger,
  MESSAGES,
  sendErrorResponse,
  signToken,
  STATUS_CODES,
} from '@/app/utils'
import bcrypt from 'bcrypt'
import { ApiResquest, COLLECTIONS, supabase } from '../../database'
import { UserLoginResponse } from './create-user'

export const loginUser = async (
  req: ApiResquest<{ email: string; password: string }>,
  res: UserLoginResponse,
) => {
  logger.info(`Received login request: ${JSON.stringify(req.body)}`)
  const { email, password } = req.body

  // Find the user by email
  const { data: user, error: userError } = await supabase
    .from(COLLECTIONS.users)
    .select('*')
    .eq('email', email)
    .single()

  if (userError || !user) {
    return sendErrorResponse({
      res,
      error: userError,
      message: MESSAGES.INVALID_CREDENTIALS,
      status: STATUS_CODES.BAD_REQUEST,
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return sendErrorResponse({
      res,
      message: MESSAGES.INVALID_CREDENTIALS,
      status: STATUS_CODES.BAD_REQUEST,
    })
  }

  const token = signToken(user)

  res.status(STATUS_CODES.OK).json({ data: { token, ...user } })
}
