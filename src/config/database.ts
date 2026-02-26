import knex, { Knex } from 'knex';
import env from './env';

const knexConfig: Knex.Config = {
    client: 'pg',
    connection: {
        connectionString: env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    },
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        directory: __dirname + '/../database/migrations',
        tableName: 'knex_migrations',
        extension: 'ts',
    },
    seeds: {
        directory: __dirname + '/../database/seeds',
        extension: 'ts',
    },
};

const db: Knex = knex(knexConfig);

export { knexConfig };
export default db;
