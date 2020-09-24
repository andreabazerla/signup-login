import * as express from 'express';

import UserController from '../controllers/user';

function setRoutes(app): void {
  const router = express.Router();

  const userController = new UserController();

  // Users
  router.route('/signup').post(userController.signup);
  router.route('/login').post(userController.login);
  router.route('/user/:id').get(userController.get);

  app.use('/api', router);
}

export default setRoutes;
