import { config } from '../config/config';
import { Dialect } from 'sequelize';

const USER: string = encodeURIComponent(config.dbUser as string);
const PASSWORD: string = encodeURIComponent(config.dbPassword);
const URI: string = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

interface DbConfig {
  url: string;
  dialect: Dialect;
}

interface Config {
  development: DbConfig;
  production: DbConfig;
}

const dbConfig: Config = {
  development: {
    url: URI,
    dialect: 'postgres',
  },
  production: {
    url: URI,
    dialect: 'postgres',
  },
};

module.exports = dbConfig;

