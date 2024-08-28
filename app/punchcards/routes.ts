import { Router } from 'express'
import { createPunchcard } from './handlers/create-punchcard'
import { deletePunchcard } from './handlers/delete-store'
import { getPunchcard } from './handlers/get-punchcard'
import { getPunchcards } from './handlers/get-punchcards'
import { updatePunchcard } from './handlers/update-punchcard'

const punchcardsRoutes = Router()

punchcardsRoutes.post('/', createPunchcard)
punchcardsRoutes.get('/', getPunchcards)
punchcardsRoutes.get('/:id', getPunchcard)
punchcardsRoutes.put('/:id', updatePunchcard)
// TODO - test delete
punchcardsRoutes.delete('/:id', deletePunchcard)

export { punchcardsRoutes }
