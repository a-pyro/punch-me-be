import bcrypt from 'bcrypt'
import { Request, Router } from 'express'
import jwt from 'jsonwebtoken'
import { supabase, TablesInsert } from '../database'
import { env } from '../utils'

const authRoutes = Router()

// authRoutes.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['email', 'profile'],
//   }),
// )

// authRoutes.get('/google/auth-url', (req, res) => {
//   const authUrl = passport.authenticate('google', {
//     scope: ['email', 'profile'],
//     session: false,
//     accessType: 'offline',
//     prompt: 'consent',
//   })

//   res.json({ url: authUrl })
// })

// authRoutes.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     accessType: 'offline',
//     scope: ['email', 'profile'],
//   }),
//   (req, res) => {
//     if (!req.user) {
//       res.status(400).json({ error: 'Authentication failed' })
//     }

//     console.log('🚀 ~ req.user:', req.user)

//     res.status(200).json(req.user)
//   },
// )

// export { authRoutes }

// User Registration
authRoutes.post(
  '/register',
  async (req: Request<any, any, TablesInsert<'users'>>, res) => {
    const { email, password, ...rest } = req.body

    // Check if the user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser)
      return res.status(400).json({ error: 'User already exists' })

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the new user
    const newUser: TablesInsert<'users'> = {
      created_at: new Date().toISOString(),
      email,
      password: hashedPassword,
      ...rest,
    }

    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()

    if (error) return res.status(500).json({ error: 'Error creating user' })

    const token = jwt.sign(
      {
        userId: data?.[0].id,
        email: data?.[0].email,
        name: data?.[0].display_name,
      },
      env.JWT_SECRET,
      { expiresIn: '1h' },
    )

    res.status(201).json({ user: data?.[0], token })
  },
)

// User Login
authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body

  // Find the user by email
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' })
  }

  // Check if the password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
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

  res.status(200).json({ token, user })
})

export { authRoutes }
