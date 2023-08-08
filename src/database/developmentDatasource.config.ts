import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();
const configService = new ConfigService();

export const developmentDbConfig = {
  type: 'postgres',
  host: process.env.DEV_DB_HOST,
  port: process.env.DEV_DB_PORT,
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_NAME,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/entities/*.entity{.js,.ts}'],
  migrations: [__dirname + '/../../dist/database/dev_migrations/*.js'],
  migrationsTableName: 'migration',
  cli: {
    migrationsDir: __dirname + '/dev_migrations/',
  },
};

export default new DataSource(developmentDbConfig as DataSourceOptions);
