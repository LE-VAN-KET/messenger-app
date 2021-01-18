import RepositoryMessage from '../repositories/repository';
import BaseController from '../../../infrastructure/Controllers/BaseController';
const repository = new RepositoryMessage();

class MessageController extends BaseController {
    async getMessageFriend(req, res) {
        const sms = await repository.getMessage(req.authUser.id, req.query.id);
        // console.log(sms);
        return res.status(200).json({ message: sms });
    }

    async getMessageUser(req, res) {
        const sms = await repository.getMessage(req.query.id, req.authUser.id);
        // console.log(sms);
        return res.status(200).json({ message: sms });
    }

    async getMessageHistory(req, res) {
        const smsHistory = await repository.getMessageHistory(req.authUser.id);
        return res.status.json({ message: smsHistory });
    }
}

export default MessageController;