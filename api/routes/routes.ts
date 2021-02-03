import * as express from 'express';
import * as passport from 'passport';

// Controllers
import UserController from '../controllers/user';
import RoomController from '../controllers/room';

function setRoutes(app): void {
  const router = express.Router();

  // Controllers
  const userController = new UserController();
  const roomController = new RoomController();

  // Users
  router.route('/signup').post(userController.signup);
  router.route('/login').post(userController.login);
  router.route('/user/:id').get(userController.get);
  router
    .route('/profile')
    .get(
      passport.authenticate('jwt', { session: false }),
      userController.profile
    );

  // Rooms
  router.route('/rooms').get(roomController.getRooms);
  router.route('/room/:id').get(roomController.get);

  app.use('/api', router);
}

export default setRoutes;
