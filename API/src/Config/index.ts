// API/src/config/index.ts
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export const config = {
  env: (process.env.NODE_ENV || 'development') as 'development' | 'production',
  port: process.env.PORT || 80,
  appName: process.env.APP_NAME || 'SSR-PWA',
  secretKey: process.env.SECRET_KEY || '544845',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'autodeploy',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'pgpass',
  },
};