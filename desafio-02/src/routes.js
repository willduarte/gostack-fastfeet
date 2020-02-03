import { Router } from 'express';

import SessionController from './app/controllers/SessionController';

import authenticated from './app/middlewares/authenticated';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Authentication required
routes.use(authenticated);

export default routes;
