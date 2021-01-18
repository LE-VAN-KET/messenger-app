
import knex from '../../../database/connection';
import Repository from '../Respositories/Repository';
import config from '../config.relationship';

const repository = new Repository();

class FriendService {
  static service;

  constructor() {
  }

  static getService() {
    if (!this.service) {
      this.service = new this();
    }
    return this.service;
  }

  async addFriendsRequest(user, emailReceiver, message) {
    // console.log(emailReceiver);
    // console.log(user);
    const receiver = await knex('users').clone().where({ email: emailReceiver }).select('*').first();
    if (!receiver) throw new Error('User is not already exist');
    if (user.id === receiver.id) {
      throw new Error('Dont allow send request to yourself');
    }
    return repository.insertFriend(user.id, receiver.id, message);
  }

  async acceptFriendReq(idSender, idReceiver) {
    const data1 = await repository.updateRelationship(idSender, idReceiver, config.ACCEPTED, '*');
    const data2 = await repository.updateRelationship(idReceiver, idSender, config.ACCEPTED, '*');
    return [...data1, ...data2];
  }

  getAllFriends(userId) {
    return repository.findByIdAndRelationship(userId, config.ACCEPTED, '*');
  }

  async getAllReqFriends(idReceiver) {
    const listReqFriends = await repository.findByIdAndRelationship(idReceiver, config.USER1_RECEIVER_USER2, '*');
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

  async getInfoFriend(idFriend) {
    const friend = await knex('users').clone().where({ id: idFriend }).select('*').first();
    return friend;
  }
}

export default FriendService;
