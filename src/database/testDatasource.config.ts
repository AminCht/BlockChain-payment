import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

export const testDbConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  dropSchema: false,
  entities: [__dirname + '/entities/*.entity{.js,.ts}'],
};

export default new DataSource(testDbConfig as DataSourceOptions);

