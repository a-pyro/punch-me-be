import {
  ApiResponse,
  ApiResquest,
  COLLECTIONS,
  User,
  UserInsert,
  supabase,
} from '@/app/database'
import { logger, signToken } from '@/utils'
import bcrypt from 'bcrypt'

export type UserLoginResponse = ApiResponse<User & { token: string }>
export const createUser = async (
  req: ApiResquest<UserInsert>,
  res: UserLoginResponse,
) => {
  logger.info(`Received request to create user: ${JSON.stringify(req.body)}`)

  const { email, password, ...rest } = req.body

  // Check if the user already exists
  const { data: existingUser } = await supabase
    .from(COLLECTIONS.users)
    .select('*')
    .eq('email', email)
    .single()

  if (existingUser) {
    logger.warn(`User already exists: ${email}`)
    return res.status(400).json({ message: 'User already exists' })
  }

  // Hash the password
  logger.info(`Hashing password for user: ${email}`)
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create the new user
  const newUser: UserInsert = {
    created_at: new Date().toISOString(),
    email,
    password: hashedPassword,
    role: 'draft',
    ...rest,
  }
  const { data, error } = await supabase
    .from(COLLECTIONS.users)
    .insert(newUser)
    .select()

  if (error) {
    logger.error(`Error creating user: ${error.message}`)
    return res.status(500).json({ message: 'Error creating user' })
  }

  logger.info(`User created successfully: ${JSON.stringify(data?.[0])}`)

  const token = signToken(data?.[0])

  logger.info(`JWT token generated for user: ${data?.[0].email}`)

  res.status(201).json({ data: { ...data?.[0], token } })
}
