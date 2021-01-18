import express from 'express';
import Controller from '../Controllers/AuthController';
import AuthRequest from '../Requests/AuthRequest';

const router = express.Router();
const controller = new Controller();
const Auth = new AuthRequest();

router.route('/login')
  .get((req, res) => res.render('app/login'))
  .post(Auth.validateSingin(), Auth['validate'].bind(this), controller.callMethod('login'));

router.route('/register')
  .get((req, res) => res.render('app/auth/register'))
  .post(Auth.validateRegister(), Auth['validate'].bind(this), controller.callMethod('registerCreateUser'));

router.get('/reset-password', (req, res) => res.render('app/reset-password'));

export default router;
