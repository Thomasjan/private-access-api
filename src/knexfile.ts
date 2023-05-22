import { Knex } from 'knex';
require('dotenv').config();


const config = {
  development: {
    client: 'mysql2',
    connection: {
      // host: process.env.DATABASE_HOST,
      // user: process.env.DATABASE_USER,
      // password: process.env.DATABASE_PASSWORD,
      // database: process.env.DATABASE_NAME,
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'gestimum_private',
    },
    migrations: {
      directory: './database/migrations',
    },
  },
};
// console.log(config)

export default config;
//: Knex.Config