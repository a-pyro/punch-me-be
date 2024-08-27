import { COLLECTIONS, ExpressRequest, WithId, supabase } from '@/app/database'
import { logger } from '@/utils'
import { Response } from 'express'

export const deleteStore = async (
  req: ExpressRequest<any, WithId>,
  res: Response,
) => {
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
}
