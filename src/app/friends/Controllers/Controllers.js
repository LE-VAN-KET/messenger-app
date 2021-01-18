import Service from '../Services/services';
import BaseController from '../../../infrastructure/Controllers/BaseController';

class FriendController extends BaseController {
    constructor() {
        super();
        this.Service = Service.getService();
    }

    async addFriendsReq(req, res) {
        try {
            const { authUser } = req;
            const { emailReceiver, message } = req.body;
            await this.Service.addFriendsRequest(authUser, emailReceiver, message);
            return res.status(200).json({ emailReceiver });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: err });
        }
    }

    async getAllReqFriends(req, res) {
        const { authUser } = req;
        // console.log(authUser);
        const listFriends = await this.Service.getAllReqFriends(authUser.id);
        // console.log(listFriends);
        return res.status(200).json({listFriends});
    }

    async allFriends(req, res) {
        const { authUser } = req;
        // console.log(authUser.id);
        const listFriends = await this.Service.getAllFriends(authUser.id);
        // console.log(listFriends);
        return res.status(200).json(listFriends);
    }

    async acceptFriendReq(req, res) {
        const { authUser } = req;
        try {
            const acceptSenderId = await this.Service.acceptFriendReq(req.body.senderId, authUser.id);
            return res.status(200).json(acceptSenderId);
        } catch (err) {
            return res.status(400).send('NOT ACCEPT');
        }
    }

    async getProfileOfFriend(req, res) {
        const idFriend = req.query.id;
        const profile = await this.Service.getInfoFriend(idFriend);
        return res.status(200).json({ profile });
    }
}

export default FriendController;
