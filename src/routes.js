import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

// Rotas sem autenticação : application/json
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// Rotas com autenticação : application/json
routes.use(authMiddleware);
routes.put('/users', UserController.update);

// Rotas para envio de arquivos : multipart/form-data
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
