import knex from 'knex';
import pg from 'pg';
import knexfile from '../../knexfile';

pg.types.setTypeParser(20, 'text', parseInt);
pg.types.setTypeParser(1700, 'text', parseInt);

const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

export default knex(config);
