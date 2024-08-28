import {
  ApiResponse,
  ApiResquest,
  COLLECTIONS,
  Punchcard,
  WithId,
  supabase,
} from '@/app/database'
import { logger } from '@/app/utils'

export const getPunchcard = async (
  req: ApiResquest<any, WithId>,
  res: ApiResponse<Punchcard>,
) => {
  const { id } = req.params

  const { data: punchcards, error } = await supabase
    .from(COLLECTIONS.punchcards)
    .select('*')
    .eq('id', id)
    .single()

  if (!punchcards || error) {
    logger.warn(`Error searching punchcard: ${JSON.stringify(error)}`)
    return res.status(404).json({ message: 'Punchcards not found' })
  }

  return res.status(200).json({ data: punchcards })
}
