import { supabase } from '@/app/database'
import {
  ApiResponse,
  ApiResquest,
  COLLECTIONS,
  Store,
  StoreInsert,
} from '@/app/database/types'
import { logger } from '@/utils'

export const createStore = async (
  req: ApiResquest<StoreInsert>,
  res: ApiResponse<Store>,
) => {
  const { user_id, ...rest } = req.body
  // Check if the user exists
  const { data: user, error: userError } = await supabase
    .from(COLLECTIONS.users)
    .select('*')
    .eq('id', user_id)
    .single()

  if (userError || !user) {
    logger.error(`Error checking existing user: ${JSON.stringify(userError)}`)
    return res.status(400).json({ message: 'User not found' })
  }

  // Create the stores
  const { data, error } = await supabase
    .from(COLLECTIONS.stores)
    .insert({
      ...rest,
      user_id,
    })
    .select()

  if (error) {
    logger.error(`Error creating stores: ${JSON.stringify(error)}`)
    return res.status(500).json({ message: 'Error creating stores' })
  }

  return res.status(201).json({ data: data?.[0] })
}
