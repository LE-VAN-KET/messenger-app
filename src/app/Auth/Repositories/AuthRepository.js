import BaseRepository from '../../../infrastructure/Repositories/BaseRepository';

class AuthRepository extends BaseRepository {
  constructor() {
    super();
    this.tableName = this.getTableName();
  }

  getTableName() {
    return 'users';
  }
}

export default AuthRepository;
