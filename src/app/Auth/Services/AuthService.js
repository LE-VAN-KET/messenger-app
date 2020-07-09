import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Repository from '../Repositories/AuthRepository';

class AuthService {
  static service;

  constructor() {
    this.repository = Repository.getRepository();
  }

  static getService() {
    if (!this.service) {
      this.service = new this();
    }
    return this.service;
  }

  static async hashPassword(password) {
    try {
      this.hash = await bcrypt.hashSync(password, 10);
    } catch (e) {
      console.log(e);
    }
    return this.hash;
  }

  generateToken(user, secretSignature, tokenLife) {
    return new Promise((resolve, reject) => {
      const userData = {
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      };
      jwt.sign({ data: userData }, secretSignature,
        {
          algorithm: 'HS256',
          expiresIn: tokenLife,
        },
        (error, token) => {
          if (error) {
            return reject(error);
          }
          resolve(token);
      });
    });
  }

  verifyToken(token, secretKey) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
          return reject(error);
        }
        return resolve(decoded.data);
      });
    });
  }
}

export default AuthService;
