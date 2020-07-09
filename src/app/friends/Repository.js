import knex from '../../database/connection';
import config from './config.relationship';

class FriendRepository {
  static repository;

  constructor() {
    this.tableName = 'friends';
  }

  static getRepository() {
    if (!this.repository) {
      this.repository = new this();
    }

    return this.repository;
  }

  cloneQuery() {
    return knex(this.tableName).clone();
  }

  insert(attributes, returning = ['*']) {
    return this.cloneQuery().insert(attributes).returning(returning);
  }

  findByIdAndRelationship(userID, relationship, columns = ['*']) {
    return this.cloneQuery().where({ userA: userID, relationship })
      .innerJoin('users', 'friends.userB', 'users.id').select(columns);
  }

  updateRelationship(userA, userB, relationship, returning = ['*']) {
    return this.cloneQuery().where({ userA, userB }).update({ relationship }).returning(returning);
  }

  getBy(clauses = {}, columns = ['*']) {
    return this.cloneQuery().where(clauses).select(columns).first();
  }

  async insertFriend(idSender, idReceiver, message) {
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
      await Promise.all([
        this.insert(friendFirst, '*'),
        this.insert(friendSecond, '*'),
      ]);
    } catch (err) {
      // console.error(err);
      throw new Error(err);
      console.log('Duplicate already exist');
    }
  }
}

export default FriendRepository;
