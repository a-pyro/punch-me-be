import { ApiResquest, COLLECTIONS, WithId, supabase } from '@/app/database'
import { logger } from '@/app/utils'
import { Response } from 'express'

export const deletePunchcard = async (
  req: ApiResquest<any, WithId>,
  res: Response,
) => {
  const { id } = req.params

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

  // Delete the punchcard
  const { error } = await supabase
    .from(COLLECTIONS.punchcards)
    .delete()
    .eq('id', id)

  if (error) {
    logger.error(`Error deleting punchcard: ${JSON.stringify(error)}`)
    return res.status(500).json({ message: 'Error deleting punchcard' })
  }

  return res.status(204).send()
}
