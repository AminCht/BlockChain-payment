import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

export const developmentDbConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [__dirname + '/entities/*.entity{.js,.ts}'],
  migrations: [__dirname + '/../../dist/database/dev_migrations/*.js'],
  migrationsTableName: 'migration',
  cli: {
    migrationsDir: __dirname + '/dev_migrations/',
  },
};

export default new DataSource(developmentDbConfig as DataSourceOptions);
