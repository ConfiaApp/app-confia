import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import StatusController from './app/controllers/StatusController';
import ChallengeController from './app/controllers/ChallengeController';
import ChallengeTypeController from './app/controllers/ChallengeTypeController';
import PlayerController from './app/controllers/PlayerController';
import TeamController from './app/controllers/TeamController';

const routes = new Router();
const upload = multer(multerConfig);

// Rotas sem autenticação : application/json
routes.post('/users', UserController.store);
routes.post('/players', PlayerController.store);
routes.post('/sessions', SessionController.store);

routes
  .post('/status', StatusController.store)
  .put('/status/:id', StatusController.update)
  .get('/status', StatusController.index)
  .get('/status/:id', StatusController.show)
  .delete('/status/:id', StatusController.delete);

// Rotas com autenticação : application/json
routes.use(authMiddleware);

routes
  .put('/users', UserController.update)
  .get('/users', UserController.index)
  .get('/users/:id', UserController.show)
  .delete('/users/:id', UserController.delete);

routes
  .put('/players/:id', PlayerController.update)
  .get('/players', PlayerController.index)
  .get('/players/:id', PlayerController.show)
  .delete('/players/:id', PlayerController.delete);

routes
  .post('/challenge-types', ChallengeTypeController.store)
  .put('/challenge-types/:id', ChallengeTypeController.update)
  .get('/challenge-types', ChallengeTypeController.index)
  .get('/challenge-types/:id', ChallengeTypeController.show)
  .delete('/challenge-types/:id', ChallengeTypeController.delete);

routes
  .post('/challenges', ChallengeController.store)
  .put('/challenges/:id', ChallengeController.update)
  .get('/challenges', ChallengeController.index)
  .get('/challenges/:id', ChallengeController.show)
  .delete('/challenges/:id', ChallengeController.delete);

routes
  .post('/teams', TeamController.store)
  .put('/teams/:id', TeamController.update)
  .get('/teams', TeamController.index)
  .get('/teams/:id', TeamController.show)
  .delete('/teams/:id', TeamController.delete);

// Rotas para envio de arquivos : multipart/form-data
routes.post('/files', upload.single('file'), FileController.store);
routes.put('/files/:id', upload.single('file'), FileController.update);
routes
  .get('/files', FileController.index)
  .get('/files/:id', FileController.show)
  .delete('/files/:id', FileController.delete);

export default routes;
