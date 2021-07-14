import { entities } from '@models/index';
import { ConnectionOptions } from 'typeorm';

export default {
  default: {
    type: 'postgres',
    host: process.env.POSTGRESQL_HOST,
    port: parseInt(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    synchronize: false,
    logging: true,
    entities,
  },
  development: {
    type: 'postgres',
    host: process.env.POSTGRESQL_HOST,
    port: parseInt(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    synchronize: true,
    // logging: true,
    dropSchema: true,
    entities,
  },
  test: {
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    logging: false,
    entities,
  },
} as { [connectionName: string]: ConnectionOptions };
