import express from 'express';
import Controller from '../Controllers/AuthController';
// import AuthMiddleware from '../Middleware/AuthMiddleware';

const router = express.Router();
const controller = new Controller();
// const middleware = new AuthMiddleware();

router.route('/login')
  .get((req, res) => res.render('app/login'))
  .post(controller.callMethod('login'));

router.route('/login-phone-number')
  .get((req, res) => res.render('app/login-phone-number'))
  .post((req) => {
    console.log(req.body);
  });

router.route('/register-app')
  .get((req, res) => res.render('app/auth/register-app'))
  .post(controller.callMethod('registerCreateUser'));

router.get('/register', (req, res) => res.render('app/auth/register'));

router.get('/register-email', controller.callMethod('registerByEmail'));

router.get('/reset-password', (req, res) => res.render('app/reset-password'));

router.route('');

export default router;
