import { COLLECTIONS, ExpressRequest, WithId, supabase } from '@/app/database'
import { logger } from '@/utils'
import { Response } from 'express'

export const getStore = async (
  req: ExpressRequest<any, WithId>,
  res: Response,
) => {
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
}
