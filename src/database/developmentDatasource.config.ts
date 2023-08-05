import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();
const configService = new ConfigService();

export const developmentDbConfig = {
  type: 'sqlite',
  database: `${process.cwd()}/db.sqlite`,
  entities: [__dirname + '/entities/*.entity{.js,.ts}'],
  migrations: [__dirname + '/../../dist/database/dev_migrations/*.js'],
  logging: false,
  migrationsTableName: 'migration',
  cli: {
    migrationsDir: __dirname + '/dev_migrations/',
  },
};

export default new DataSource(developmentDbConfig as DataSourceOptions);
