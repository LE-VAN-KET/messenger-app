import config from '../config.relationship';
import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';

class FriendRepository extends BaseRepository {
  // static repository;

  constructor() {
    super();
    this.tableName = this.getTableName();
  }

  getTableName() {
    return 'friends';
  }

  // static getRepository() {
  //   if (!this.repository) {
  //     this.repository = new this();
  //   }

  //   return this.repository;
  // }

  findByIdAndRelationship(userID, relationship, columns = ['*']) {
    return this.cloneQuery().where({ userA: userID, relationship })
      .innerJoin('users', 'friends.userB', 'users.id').select(columns);
  }

  updateRelationship(userA, userB, relationship, returning = ['*']) {
    return this.cloneQuery().where({ userA, userB }).update({ relationship }).returning(returning);
  }

  insertFriend(idSender, idReceiver, message) {
    const friendFirst = {
      userA: idSender,
      userB: idReceiver,
      relationship: config.USER1_REQUEST_USER2,
      message,
    };

    const friendSecond = {
      userA: idReceiver,
      userB: idSender,
      relationship: config.USER1_RECEIVER_USER2,
      message,
    };

    try {
      return Promise.all([
        this.create(friendFirst, '*'),
        this.create(friendSecond, '*'),
      ]);
    } catch (err) {
      // console.error(err);
      throw new Error(err);
      console.log('Duplicate already exist');
    }
  }
}

export default FriendRepository;
