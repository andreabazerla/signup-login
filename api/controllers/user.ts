import BaseController from './base';
import * as passport from 'passport';

import User from '../models/user';
import { IUser } from './../models/user';

class UserController extends BaseController {
  model = User;

  signup = (req, res) => {
    const user = new this.model({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      gender: req.body.gender,
      birthday: req.body.birthday,
    });

    user.setPassword(user, req.body.password);

    user
      .save()
      .then(() => {
        res.status(201).json({
          success: true,
          message: 'User created.',
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Invalid authentication credentials.',
        });
      });
  }

  login = (req, res) => {
    const error401 = 401;
    const error201 = 201;

    this.model
      .findOne({ email: req.body.email })
      .then((user: IUser) => {
        if (!user) {
          return res.status(error401).json({
            success: false,
            error: {
              code: error401,
              message: 'User unknown',
            },
          });
        }

        const isValid = user.checkPassword(user, req.body.password);
        if (!isValid) {
          return res.status(error401).json({
            success: false,
            error: {
              code: error401,
              message: 'Wrong password',
            },
          });
        }

        const tokenObject = user.generateJwt(user);

        return res.status(error201).json({
          success: true,
          message: 'Login successful',
          token: tokenObject.token,
          expiresIn: tokenObject.expiresIn,
        });
      })
      .catch((err) => console.error(err));
  }

  profile = (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Successfully authenticated',
    });
  }
}

export default UserController;
