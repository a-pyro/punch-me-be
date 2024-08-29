import { supabase } from '@/app/database'
import {
  ApiResponse,
  ApiResquest,
  COLLECTIONS,
  Punchcard,
  PunchcardInsert,
} from '@/app/database/types'
import { logger, STATUS_CODES } from '@/app/utils'

export const createPunchcard = async (
  req: ApiResquest<PunchcardInsert>,
  res: ApiResponse<Punchcard>,
) => {
  const { data, error } = await supabase
    .from(COLLECTIONS.punchcards)
    .insert(req.body)
    .select()

  if (error) {
    logger.error(`Error creating punchcards: ${JSON.stringify(error)}`)
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: 'Error creating punchcards' })
  }
  const punchcard = data?.[0]

  return res.status(STATUS_CODES.CREATED).json({ data: punchcard })
}
