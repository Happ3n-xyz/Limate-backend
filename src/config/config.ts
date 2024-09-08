import dotenv from 'dotenv';
dotenv.config();

interface Config {
  env: string;
  port: number;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  dbName: string;
  dbPort: string;
  jwtSecret: string;
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'postgres',
  dbHost: process.env.DB_HOST || 'localhost',
  dbName: process.env.DB_NAME || 'postgres',
  dbPort: process.env.DB_PORT || '5432',
  jwtSecret: process.env.JWT_SECRET || 'secret',
}

export { config };

