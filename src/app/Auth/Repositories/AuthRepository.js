import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';

class AuthRepository extends BaseRepository {
  static repository;

  static getRepository() {
    if (!this.repository) {
      this.repository = new this();
    }

    return this.repository;
  }

  getTableName() {
    return 'users';
  }
}

export default AuthRepository;
