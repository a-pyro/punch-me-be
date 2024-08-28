import {
  ApiResponse,
  ApiResquest,
  COLLECTIONS,
  Store,
  WithId,
  supabase,
} from '@/app/database'
import { STATUS_CODES, logger } from '@/app/utils'

export const getStore = async (
  req: ApiResquest<any, WithId>,
  res: ApiResponse<Store>,
) => {
  const { id } = req.params

  const { data: stores, error } = await supabase
    .from(COLLECTIONS.stores)
    .select('*')
    .eq('id', id)
    .single()

  if (!stores || error) {
    logger.warn(`Error searching store: ${JSON.stringify(error)}`)
    return res
      .status(STATUS_CODES.NOT_FOUND)
      .json({ message: 'Stores not found' })
  }

  return res.status(STATUS_CODES.OK).json({ data: stores })
}
