import {
  ApiResquest,
  COLLECTIONS,
  StoreUpdate,
  WithId,
  supabase,
} from '@/app/database'
import { logger } from '@/utils'
import { Response } from 'express'

export const updateStore = async (
  req: ApiResquest<StoreUpdate, WithId>,
  res: Response,
) => {
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
}
