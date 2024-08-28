import {
  ApiResquest,
  COLLECTIONS,
  PunchcardUpdate,
  WithId,
  supabase,
} from '@/app/database'
import { logger } from '@/app/utils'
import { Response } from 'express'

export const updatePunchcard = async (
  req: ApiResquest<PunchcardUpdate, WithId>,
  res: Response,
) => {
  const { id } = req.params
  const punchcardUpdate = req.body

  // Check if the punchcard exists
  const { data: punchcard, error: punchcardError } = await supabase
    .from(COLLECTIONS.punchcards)
    .select('*')
    .eq('id', id)
    .single()

  if (punchcardError || !punchcard) {
    logger.error(
      `Error checking existing punchcard: ${JSON.stringify(punchcardError)}`,
    )
    return res.status(400).json({ message: 'Punchcard not found' })
  }

  // Update the punchcard
  const { data, error } = await supabase
    .from(COLLECTIONS.punchcards)
    .update(punchcardUpdate)
    .eq('id', id)
    .select()

  if (error) {
    logger.error(`Error updating punchcard: ${JSON.stringify(error)}`)
    return res.status(500).json({ message: 'Error updating punchcard' })
  }

  return res.status(200).json({ data })
}
