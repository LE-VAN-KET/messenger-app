import express from 'express';
import Controller from './Controllers';
import AuthMiddleware from '../Auth/Middleware/AuthMiddleware';

const router = express.Router();
const controller = new Controller();
const middleware = new AuthMiddleware();

router.use(middleware.isAuth);

router.route('/requests')
    .get(controller.callMethod('getAllReqFriends'))
    .post(controller.callMethod('addFriendsReq'));

router
    .get('/allfriends', controller.callMethod('allFriends'))
    .put('/accept', controller.callMethod('acceptFriendReq'));

export default router;
