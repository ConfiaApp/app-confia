import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas sem autenticação
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// Rotas com autenticação
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
