import {
  ApiResponse,
  ApiResquest,
  COLLECTIONS,
  Store,
  WithId,
  supabase,
} from '@/app/database'
import { MESSAGES, STATUS_CODES, sendErrorResponse } from '@/app/utils'

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
    return sendErrorResponse({
      res,
      message: MESSAGES.STORE_NOT_FOUND,
      status: STATUS_CODES.NOT_FOUND,
      error,
    })
  }

  return res.status(STATUS_CODES.OK).json({ data: stores })
}
