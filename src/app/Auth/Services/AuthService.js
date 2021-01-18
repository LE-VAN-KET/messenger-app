import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import AuthRepository from '../Repositories/AuthRepository';

const repository = new AuthRepository();

class AuthService extends AuthRepository {
  static service;

  constructor() {
    super();
  }

  static getService() {
    if (!this.service) {
      this.service = new this();
    }
    return this.service;
  }

  async hashPassword(password) {
    try {
      this.hash = await bcrypt.hash(password, 10);
      console.log(this.hash);
      return this.hash;
    } catch (e) {
      console.log(e);
    }
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

  async createUser(data) {
    const { firstName, lastName, email, password, avatar } = data;
    const Password = await this.hashPassword(password);
    const newUser = {
      firstName,
      lastName,
      email,
      password: Password,
      avatar,
    };
    return repository.create(newUser, '*');
  }

  async singin(data) {
    const user = await repository.getBy({ email: data.email }, '*');
    let Token, refreshToken;
    const token = this.generateToken(user, process.env.ACCESS_TOKEN_SECRET, '20h');
    const resetToken = this.generateToken(user, process.env.REFRESH_TOKEN_SECRET, '7d');
    Token = await token;
    refreshToken = await resetToken;
    return [Token, refreshToken];
  }
}

export default AuthService;
