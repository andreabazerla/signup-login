import BaseController from './base';
import * as passport from 'passport';

import User from '../models/user';

class UserController extends BaseController {
  model = User;

  signup = (req, res) => {

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      gender: req.body.gender,
      birthday: req.body.birthday,
    });

    user.setPassword(req.body.password);

    user
      .save()
      .then((result) => {
        res.status(201);
        res.json({
          message: 'User created.',
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: 'Invalid authentication credentials.',
        });
      });
  }

  login = (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      let token: string;
      if (err) {
        res.status(404).json(err);
        return;
      }

      if (user) {
        token = user.generateJwt();
        res.status(201);
        res.json({
          token,
          expiresIn: 3600,
          userId: user._id,
          userUsername: user.username,
        });
        // res.redirect('/users/' + req.user.username);
      } else {
        res.status(401).json(info);
      }
    })(req, res);
  }
}

export default UserController;

// exports.getUserProfile = (req, res) => {
//   User.findById(req.params.id)
//     .then(user => {
//       if (user) {
//         res.status(200).json(user);
//       } else {
//         res.status(404).json({ message: "User not found!" });
//       }
//     })
//     .catch(error => {
//       res.status(500).json({
//         message: "Fetching user failed!"
//       });
//     });
// }
