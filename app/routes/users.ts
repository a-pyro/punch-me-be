import bcrypt from 'bcrypt'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import {
  COLLECTIONS,
  ExpressRequest,
  supabase,
  UserInsert,
  UserUpdate,
} from '../database'
import { authenticateJWT } from '../middlewares'
import { env, logger } from '../utils'

const userRoutes = Router()

// User Registration
userRoutes.post('/', async (req: ExpressRequest<UserInsert>, res) => {
  logger.info(`Received request to create user: ${JSON.stringify(req.body)}`)

  const { email, password, ...rest } = req.body

  // Check if the user already exists
  const { data: existingUser, error: existingUserError } = await supabase
    .from(COLLECTIONS.users)
    .select('*')
    .eq('email', email)
    .single()

  if (existingUserError) {
    logger.error(`Error checking existing user: ${existingUserError.message}`)
    return res.status(500).json({ error: 'Error checking existing user' })
  }

  if (existingUser) {
    logger.warn(`User already exists: ${email}`)
    return res.status(400).json({ error: 'User already exists' })
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
    return res.status(500).json({ error: 'Error creating user' })
  }

  logger.info(`User created successfully: ${JSON.stringify(data?.[0])}`)

  const token = jwt.sign(
    {
      userId: data?.[0].id,
      email: data?.[0].email,
      name: data?.[0].display_name,
    },
    env.JWT_SECRET,
    { expiresIn: '1h' },
  )

  logger.info(`JWT token generated for user: ${data?.[0].email}`)

  res.status(201).json({ data: data?.[0], token })
})

userRoutes.put(
  '/:id',
  authenticateJWT,
  async (req: ExpressRequest<UserUpdate>, res) => {
    logger.info(`Received request to update user: ${JSON.stringify(req.body)}`)

    const { id } = req.params
    const { email, ...rest } = req.body

    // Check if the user already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from(COLLECTIONS.users)
      .select('*')
      .eq('id', id)
      .single()

    if (existingUserError) {
      logger.error(`Error checking existing user: ${existingUserError.message}`)
      return res.status(500).json({ error: 'Error checking existing user' })
    }

    if (!existingUser) {
      logger.warn(`User does not exist: ${id}`)
      return res.status(400).json({ error: 'User does not exist' })
    }

    // Hash the password
    if (rest.password) {
      logger.info(`Hashing password for user: ${email}`)
      const hashedPassword = await bcrypt.hash(rest.password, 10)
      rest.password = hashedPassword
    }

    // Update the user
    const updatedUser: UserInsert = {
      ...existingUser,
      ...rest,
    }
    const { data, error } = await supabase
      .from(COLLECTIONS.users)
      .update(updatedUser)
      .eq('id', id)
      .select()

    if (error) {
      logger.error(`Error updating user: ${error.message}`)
      return res.status(500).json({ error: 'Error updating user' })
    }

    logger.info(`User updated successfully: ${JSON.stringify(data?.[0])}`)

    res.status(200).json({ data: data?.[0] })
  },
)

// User Login
userRoutes.post(
  '/login',
  async (req: ExpressRequest<{ email: string; password: string }>, res) => {
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

    // Create a JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.display_name,
      },
      env.JWT_SECRET,
      { expiresIn: '1h' },
    )

    logger.info(`JWT token generated for user: ${email}`)

    res.status(200).json({ token, data: user })
  },
)

export { userRoutes }
