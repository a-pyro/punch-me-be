import { supabase } from '@/app/database'
import {
  ApiResponse,
  ApiResquest,
  COLLECTIONS,
  Store,
  StoreInsert,
} from '@/app/database/types'
import { logger } from '@/app/utils'

export const createStore = async (
  req: ApiResquest<StoreInsert>,
  res: ApiResponse<Store>,
) => {
  const { data, error } = await supabase
    .from(COLLECTIONS.stores)
    .insert(req.body)
    .select()

  if (error) {
    logger.error(`Error creating stores: ${JSON.stringify(error)}`)
    return res.status(500).json({ message: 'Error creating stores' })
  }
  const store = data?.[0]

  return res.status(201).json({ data: store })
}
