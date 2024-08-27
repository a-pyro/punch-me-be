import {
  ApiResponse,
  ApiResquest,
  COLLECTIONS,
  Store,
  supabase,
  WithId,
} from '@/app/database'
import { logger } from '@/utils'

export const getStores = async (
  { query }: ApiResquest<any, any, WithId>,
  res: ApiResponse<Store[]>,
) => {
  const { id } = query

  const { data: stores, error } = await supabase
    .from(COLLECTIONS.stores)
    .select('*')
    .eq('user_id', id)

  if (error) {
    logger.error(`Error fetching stores: ${JSON.stringify(error)}`)
    return res.status(500).json({ message: 'Error fetching stores' })
  }

  return res.status(200).json({ data: stores })
}
