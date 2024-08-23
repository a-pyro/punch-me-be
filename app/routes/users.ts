import bcrypt from 'bcrypt'
import { Request, Router } from 'express'
import jwt from 'jsonwebtoken'
import { supabase, TablesInsert } from '../database'
import { env, logger } from '../utils'

const users = Router()

// User Registration
users.post(
  '/create',
  async (req: Request<any, any, TablesInsert<'users'>>, res) => {
    logger.info(`Received request to create user: ${JSON.stringify(req.body)}`)

    const { email, password, ...rest } = req.body

    // Check if the user already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
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
    const newUser: TablesInsert<'users'> = {
      created_at: new Date().toISOString(),
      email,
      password: hashedPassword,
      role: 'draft',
      ...rest,
    }
    const { data, error } = await supabase
      .from('users')
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

    res.status(201).json({ user: data?.[0], token })
  },
)

// User Login
users.post('/login', async (req, res) => {
  logger.info(`Received login request: ${JSON.stringify(req.body)}`)
  const { email, password } = req.body

  // Find the user by email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (userError) {
    logger.error(`Error finding user: ${userError.message}`)
    return res.status(500).json({ error: 'Error finding user' })
  }

  if (!user) {
    logger.warn(`Invalid email or password for email: ${email}`)
    return res.status(400).json({ error: 'Invalid email or password' })
  }

  // Check if the password is correct
  logger.info(`Checking password for user: ${email}`)
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    logger.warn(`Invalid password for email: ${email}`)
    return res.status(400).json({ error: 'Invalid email or password' })
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

  res.status(200).json({ token, user })
})

export { users }
