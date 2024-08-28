import { supabase } from '@/app/database'
import {
  ApiResponse,
  ApiResquest,
  COLLECTIONS,
  Punchcard,
  PunchcardInsert,
} from '@/app/database/types'
import { logger } from '@/app/utils'

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
    return res.status(500).json({ message: 'Error creating punchcards' })
  }
  const punchcard = data?.[0]

  return res.status(201).json({ data: punchcard })
}
