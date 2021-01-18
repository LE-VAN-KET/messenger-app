import { check } from 'express-validator';
import bcrypt from 'bcrypt';
import BaseRequest from '../../../infrastructure/Requests/BaseRequest';
import AuthRepository from '../Repositories/AuthRepository';

const repository = new AuthRepository();

class AuthRequest extends BaseRequest {
  constructor() {
    super();
  }
    /**
   * check value input form register
   * @return { errors }
   */
  validateRegister() {
    return [
      check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
      check('email').custom(async value => {
        const exists = await repository.getBy({ email: value }, '*');
        if (exists) {
          throw new Error('E-mail already in use.');
        }
        return true;
      })
    ]
  }

  validateSingin() {
    return [
      check('email').custom(async value => {
        let email = await repository.getBy({ email: value }, 'email');
        if (!email) throw new Error('Email not exist.');
        return true;
      }),
      check('password').custom(async (value, { req }) => {
        let password_first = await repository.getBy({ email: req.body.email }, 'password');
        let flasg = await bcrypt.compare(value, password_first.password);
        if (!flasg) throw new Error('Password is not match.');
        return true;
      })
    ]
  }

}

export default AuthRequest;