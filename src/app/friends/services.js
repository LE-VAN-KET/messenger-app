
import Repository from './Repository';
import config from './config.relationship';
import BaseRepository from '../../infrastructure/Repositories/BaseRepository';

class FriendService extends Repository {
  static service;

  constructor() {
    super();
    this.BaseRepository = new BaseRepository();
  }

  static getService() {
    if (!this.service) {
      this.service = new this();
    }
    return this.service;
  }

  async addFriendsReq(user, emailReceiver, message) {
    // console.log(emailReceiver);
    // console.log(user)
    const receiver = await this.BaseRepository.getBy({ email: emailReceiver }, '*');
    if (user.id === receiver.id) {
      throw new Error('Dont allow send request to yourself');
    }
    if (!receiver) throw new Error('User is not already exist');
    return this.insertFriend(user.id, receiver.id, message);
  }

  async acceptFriendReq(idSender, idReceiver) {
    const data1 = await this.updateRelationship(idSender, idReceiver, config.ACCEPTED, '*');
    const data2 = await this.updateRelationship(idReceiver, idSender, config.ACCEPTED, '*');
    return [...data1, ...data2];
  }

  getAllFriends(userId) {
    return this.findByIdAndRelationship(userId, config.ACCEPTED, '*');
  }

  async getAllReqFriends(idReceiver) {
    const listReqFriends = await this.findByIdAndRelationship(idReceiver, config.USER1_RECEIVER_USER2, '*');
    // console.log(listReqFriends);

    return listReqFriends.map((user) => {
      return {
        id: user.userB,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        message: user.message,
      };
    });
  }
}

export default FriendService;
