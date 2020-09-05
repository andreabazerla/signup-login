import * as express from 'express';

import UserController from '../controllers/user';

function setRoutes(app): void {
  const router = express.Router();

  const userController = new UserController();

  // Users
  router.post('/signup', userController.signup);
  router.post('/login', userController.login);
  // router.get('/:id', userController.getUserProfile);

  app.use('/api', router);
}

export default setRoutes;
