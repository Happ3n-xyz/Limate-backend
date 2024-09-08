import { Dialect, Sequelize } from 'sequelize';
import { config } from '../config/config';
import setupModels from '../db/models';

const USER: string = encodeURIComponent(config.dbUser as string);
const PASSWORD: string = encodeURIComponent(config.dbPassword as string);
const URI: string = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URI, {
  dialect: 'postgres' as Dialect,
  logging: false,
});

setupModels(sequelize);

// Synchronizing the models (Note: Use migrations in production)
sequelize.sync();

export default sequelize;

