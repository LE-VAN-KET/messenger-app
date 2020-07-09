
import BaseController from '../../../infrastructure/Controllers/BaseController';
import Service from '../Services/AuthService';
import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';

class AuthController extends BaseController {
  constructor() {
    super();
    this.service = Service.getService();
  }

  registerByEmail(req, res) {
    return res.render('app/auth/register-email');
  }

  async registerCreateUser(req, res) {
    const { phoneNumber } = req.body;
    const password = await Service.hashPassword(req.body.password);
    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password,
      phoneNumber,
      avatar: req.body.avatar,
    };
    // const exists = await new BaseRepository().getBy({ phoneNumber }, '*');
    // if (exists) {
    //   console.log('phone already exists');
    //   return res.send('Phone already exists');
    // }
    const user = await new BaseRepository().create(data, '*');
    return res.json(user);
  }

  async login(req, res) {
    try {
      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '1h';
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-anhle1512001@gmail.com';
      const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '3650d';
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret-anhle1512001@gmail.com';
      const user = await new BaseRepository().getBy({ email: req.body.email }, '*');
      const accessToken = await new Service().generateToken(user, accessTokenSecret, accessTokenLife);
      const refreshToken = await new Service().generateToken(user, refreshTokenSecret, refreshTokenLife);
      return res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

}

export default AuthController;
