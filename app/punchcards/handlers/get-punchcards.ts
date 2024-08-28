import {
  ApiResponse,
  ApiResquest,
  COLLECTIONS,
  Punchcard,
  supabase,
} from '@/app/database'
import { logger } from '@/app/utils'

export const getPunchcards = async (
  { query }: ApiResquest<any, any, { store_id: string }>,
  res: ApiResponse<Punchcard[]>,
) => {
  const { store_id } = query

  const { data: punchcards, error } = await supabase
    .from(COLLECTIONS.punchcards)
    .select('*')
    .eq('store_id', store_id)

  if (error) {
    logger.error(`Error fetching punchcards: ${JSON.stringify(error)}`)
    return res.status(500).json({ message: 'Error fetching punchcards' })
  }

  return res.status(200).json({ data: punchcards })
}
