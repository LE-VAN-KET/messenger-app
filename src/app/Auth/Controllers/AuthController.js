
import dotenv from 'dotenv';
dotenv.config();
import AuthService from '../Services/AuthService';
import BaseController from '../../../infrastructure/Controllers/BaseController';

const service = new AuthService();

class AuthController extends BaseController {
  constructor() {
    super();
  }

  async registerCreateUser(req, res) {
    try {
      let user = await service.createUser(req.body);
      return res.status(200).json({ user, messages: req.flash('success', 'Register success!')});
    }
    catch(err) {
      return res.status(500).json({ messages: { error: err}});
    };
  }

  async login(req, res) {
    try {
      const token = await service.singin(req.body);
      let accessToken = token[0];
      let refreshToken = token[1];
      req.header.refreshToken = refreshToken;
      return res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      return res.status(500).json({ messages: { error: err}});
    }
  }

}

export default AuthController;
