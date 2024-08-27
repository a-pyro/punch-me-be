import {
  COLLECTIONS,
  ExpressRequest,
  UserInsert,
  UserUpdate,
  supabase,
} from '@/app/database'
import { logger } from '@/utils'
import { Response } from 'express'

export const updateUser = async (
  req: ExpressRequest<UserUpdate>,
  res: Response,
) => {
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
}
