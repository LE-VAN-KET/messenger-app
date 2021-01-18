import express from 'express';
import AuthMiddleware from '../../Auth/Middleware/AuthMiddleware';
import MessageController from '../controllers/message.controller';

const router = express.Router();
const middleware = new AuthMiddleware();
const controller = new MessageController();
router.use(middleware['isAuth'].bind(this));

router.route('/message-friend')
    .get(middleware['isAuth'].bind(this), controller.callMethod('getMessageFriend'));

router.route('/message-user')
    .get(middleware['isAuth'].bind(this), controller.callMethod('getMessageUser'));

router.route('/message-history')
    .get(middleware['isAuth'].bind(this), controller.callMethod('getMessageHistory'));

export default router;