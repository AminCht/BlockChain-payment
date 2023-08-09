import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();
const configService = new ConfigService();

export const testDbConfig = {
  type: 'postgres',
  host: process.env.TEST_DB_HOST,
  port: process.env.TEST_DB_PORT,
  username: process.env.TEST_DB_USERNAME,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_NAME,
  synchronize: false,
  logging: true,
  entities: [__dirname + '/entities/*.entity{.js,.ts}'],
  migrations: [__dirname + '/../../dist/database/test_migrations/*.js'],
  migrationsTableName: 'migration',
  cli: {
    migrationsDir: __dirname + '/dev_migrations/',
  },
};

export default new DataSource(testDbConfig as DataSourceOptions);

