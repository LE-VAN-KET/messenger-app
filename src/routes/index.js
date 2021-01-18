import express from 'express';
import authRouter from '../app/Auth/Routes/routes';
import friendsRouter from '../app/friends/Routers/routes';
import AuthMiddleware from '../app/Auth/Middleware/AuthMiddleware';
import messageRouter from '../app/messages/routers/message.router';

const router = express.Router();
const middleware = new AuthMiddleware();

router.use(authRouter);

router.use('/friends', middleware['isAuth'].bind(this), friendsRouter);

router.use('/messages', middleware['isAuth'].bind(this), messageRouter);

router.get('/', (req, res) => res.redirect('/login'));

router.get('/conversations', (req, res) => {
    return res.render('app/conversation/index');
});

export default router;
