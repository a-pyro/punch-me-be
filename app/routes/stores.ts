import { Router } from 'express'
import {
  COLLECTIONS,
  ExpressRequest,
  StoreInsert,
  StoreUpdate,
  supabase,
} from '../database'
import { logger } from '../utils'

const storesRoutes = Router()

//  TODO CHECK USER PERMISSIONS

storesRoutes.post('/', async (req: ExpressRequest<StoreInsert>, res) => {
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
  const { data, error } = await supabase.from(COLLECTIONS.stores).insert({
    ...rest,
    user_id,
  })

  if (error) {
    logger.error(`Error creating stores: ${JSON.stringify(error)}`)
    return res.status(500).json({ message: 'Error creating stores' })
  }

  return res.status(201).json({ data })
})

storesRoutes.get('/:id', async (req, res) => {
  const { id } = req.params

  const { data: stores, error } = await supabase
    .from(COLLECTIONS.stores)
    .select('*')
    .eq('id', id)
    .single()

  if (!stores || error) {
    logger.warn(`Error searching store: ${JSON.stringify(error)}`)
    return res.status(404).json({ message: 'Stores not found' })
  }

  return res.status(200).json({ data: stores })
})

storesRoutes.put('/:id', async (req: ExpressRequest<StoreUpdate>, res) => {
  const { id } = req.params
  const storeUpdate = req.body

  // Check if the store exists
  const { data: store, error: storeError } = await supabase
    .from(COLLECTIONS.stores)
    .select('*')
    .eq('id', id)
    .single()

  if (storeError || !store) {
    logger.error(`Error checking existing store: ${JSON.stringify(storeError)}`)
    return res.status(400).json({ message: 'Store not found' })
  }

  // Update the store
  const { data, error } = await supabase
    .from(COLLECTIONS.stores)
    .update(storeUpdate)
    .eq('id', id)
    .select()

  if (error) {
    logger.error(`Error updating store: ${JSON.stringify(error)}`)
    return res.status(500).json({ message: 'Error updating store' })
  }

  return res.status(200).json({ data })
})

storesRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params

  // Check if the store exists
  const { data: store, error: storeError } = await supabase
    .from(COLLECTIONS.stores)
    .select('*')
    .eq('id', id)
    .single()

  if (storeError || !store) {
    logger.error(`Error checking existing store: ${JSON.stringify(storeError)}`)
    return res.status(400).json({ message: 'Store not found' })
  }

  // Delete the store
  const { error } = await supabase
    .from(COLLECTIONS.stores)
    .delete()
    .eq('id', id)

  if (error) {
    logger.error(`Error deleting store: ${JSON.stringify(error)}`)
    return res.status(500).json({ message: 'Error deleting store' })
  }

  return res.status(204).send()
})

export { storesRoutes }
