import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import SessionController from './app/controllers/SessionController'

/* administrators */
import RecipientController from './app/controllers/RecipientController'
import FileController from './app/controllers/FileController'
import DeliverymanController from './app/controllers/DeliverymanController'
import OrderController from './app/controllers/OrderController'
/* deliveryman */
import DeliverymanDashboardController from './app/controllers/DeliverymanDashboardController'
import DeliveryController from './app/controllers/DeliveryController'
import OrderIssueController from './app/controllers/OrderIssueController'

import authenticated from './app/middlewares/authenticated'

const routes = new Router()
const upload = multer(multerConfig)

routes.post('/sessions', SessionController.store)

/* deliveryman */
routes.get('/deliverymen/:id/orders', DeliverymanDashboardController.pending)
routes.get('/deliverymen/:id/orders/finished', DeliverymanDashboardController.finished)
routes.put('/deliverymen/:id/orders/:order_id', upload.single('file'), DeliveryController.update)
routes.get('/deliveries/:id/issues', DeliveryController.issues)
routes.post('/deliveries/:id/issues', DeliveryController.store)

// Authentication required
routes.use(authenticated)

/* administrators */
routes.post('/recipients', RecipientController.store)
routes.put('/recipients/:id', RecipientController.update)

routes.post('/files', upload.single('file'), FileController.store)

routes.get('/deliverymen', DeliverymanController.index)
routes.post('/deliverymen', DeliverymanController.store)
routes.put('/deliverymen/:id', DeliverymanController.update)
routes.delete('/deliverymen/:id', DeliverymanController.delete)

routes.get('/orders', OrderController.index)
routes.post('/orders', OrderController.store)
routes.put('/orders/:id', OrderController.update)
routes.delete('/orders/:id', OrderController.delete)

routes.get('/orderissues', OrderIssueController.index)
routes.delete('/orderissues/:id', OrderIssueController.cancel)

export default routes
