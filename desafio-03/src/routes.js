import { Router } from 'express'

import SessionController from './app/controllers/SessionController'
import RecipientController from './app/controllers/RecipientController'

import authenticated from './app/middlewares/authenticated'

const routes = new Router()

routes.post('/sessions', SessionController.store)

// Authentication required
routes.use(authenticated)

routes.post('/recipients', RecipientController.store)
routes.put('/recipients/:id', RecipientController.update)

export default routes
