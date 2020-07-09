import express from 'express';
import authRouter from '../app/Auth/Routes/routes';
import friendsRouter from '../app/friends/routes';
import AuthMiddleware from '../app/Auth/Middleware/AuthMiddleware';

const router = express.Router();
const middleware = new AuthMiddleware();

router.use(authRouter);

router.use('/friends', friendsRouter);

router.get('/', (req, res) => res.redirect('/login'));

router.get('/conversations', (req, res) => {
    return res.render('app/conversation/index');
});

export default router;
