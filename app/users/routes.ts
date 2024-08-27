import { Router } from 'express'
import { authenticateJWT } from '../middlewares'
import { createUser } from './handlers/create-user'
import { loginUser } from './handlers/login-user'
import { updateUser } from './handlers/update-user'

const userRoutes = Router()

userRoutes.post('/', createUser)

userRoutes.put('/:id', authenticateJWT, updateUser)

userRoutes.post('/login', loginUser)

export { userRoutes }
