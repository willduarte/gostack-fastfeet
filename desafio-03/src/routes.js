import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import SessionController from './app/controllers/SessionController'
import RecipientController from './app/controllers/RecipientController'
import FileController from './app/controllers/FileController'
import DeliverymanController from './app/controllers/DeliverymanController'

import authenticated from './app/middlewares/authenticated'

const routes = new Router()
const upload = multer(multerConfig)

routes.post('/sessions', SessionController.store)

// Authentication required
routes.use(authenticated)

routes.post('/recipients', RecipientController.store)
routes.put('/recipients/:id', RecipientController.update)

routes.post('/files', upload.single('file'), FileController.store)

routes.get('/deliverymen', DeliverymanController.index)
routes.post('/deliverymen', DeliverymanController.store)
routes.put('/deliverymen/:id', DeliverymanController.update)
routes.delete('/deliverymen/:id', DeliverymanController.delete)

export default routes
