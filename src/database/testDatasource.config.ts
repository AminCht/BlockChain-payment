import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();
const configService = new ConfigService();

export const testDbConfig = {
  type: 'better-sqlite3',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  entities: [__dirname + '/entities/*.entity.{js,ts}'],
};

export default new DataSource(testDbConfig as DataSourceOptions);

