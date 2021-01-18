import express from 'express';
import Controller from '../Controllers/Controllers';
import AuthMiddleware from '../../Auth/Middleware/AuthMiddleware';

const router = express.Router();
const controller = new Controller();
const middleware = new AuthMiddleware();

router.use(middleware['isAuth'].bind(this));

router.route('/requests')
    .get(middleware['isAuth'].bind(this), controller.callMethod('getAllReqFriends'))
    .post(middleware['isAuth'].bind(this), controller.callMethod('addFriendsReq'));

router
    .get('/allfriends', middleware['isAuth'].bind(this), controller.callMethod('allFriends'))
    .put('/accept', middleware['isAuth'].bind(this), controller.callMethod('acceptFriendReq'));

router.route('/profileOfFriend')
    .get(middleware['isAuth'].bind(this), controller.callMethod('getProfileOfFriend'));

export default router;
