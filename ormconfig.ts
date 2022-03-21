import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
dotenv.config({
  path: '.env',
});

const config: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'task_manager',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default config;
