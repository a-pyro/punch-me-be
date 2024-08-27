import { Router } from 'express'
import { createStore } from './handlers/create-store'
import { deleteStore } from './handlers/delete-store'
import { getStore } from './handlers/get-store'
import { getStores } from './handlers/get-stores'
import { updateStore } from './handlers/update-store'

const storesRoutes = Router()

storesRoutes.post('/', createStore)
storesRoutes.get('/', getStores)
storesRoutes.get('/:id', getStore)
storesRoutes.put('/:id', updateStore)
// TODO - test delete
storesRoutes.delete('/:id', deleteStore)

export { storesRoutes }
