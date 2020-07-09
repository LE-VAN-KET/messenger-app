import knex from '../../database/connection';

class BaseRepository {
  constructor() {
    this.tableName = 'users';
  }

  cloneQuery() {
    return knex(this.tableName).clone();
  }

  list(columns = ['*']) {
    return this.cloneQuery().select(columns);
  }

  listBy(clauses = {}, columns = ['*']) {
    return this.cloneQuery().where(clauses).select(columns);
  }

  count() {
    return this.cloneQuery().count();
  }

  countBy(clauses = {}) {
    return this.cloneQuery().where(clauses).count();
  }

  getBy(clauses = {}, columns = ['*']) {
    return this.cloneQuery().where(clauses).select(columns).first();
  }

  create(attributes, returning = ['*']) {
    return this.cloneQuery().insert(attributes).returning(returning);
  }

  update(clauses, attributes, returning = ['*']) {
    return this.cloneQuery().where(clauses).update(attributes).returning(returning);
  }

  delete(clauses) {
    return this.cloneQuery().where(clauses).delete();
  }
}

export default BaseRepository;
