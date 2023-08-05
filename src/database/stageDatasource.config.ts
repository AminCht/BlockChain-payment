import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config({ path: `${process.env.ENV}.env` });

export const stageDbConfig = {
  type: 'mysql',
  host: process.env.STAGE_DB_HOST,
  port: process.env.STAGE_DB_PORT,
  username: process.env.STAGE_DB_USERNAME,
  password: process.env.STAGE_DB_PASSWORD,
  database: process.env.STAGE_DB_NAME,
  synchronize: false,
  logging: true,
  entities: [__dirname + '/entities/*.entity{.js,.ts}'],
  migrations: [__dirname + '/../../dist/database/stage_migrations/*.js'],
  migrationsTableName: 'migration',
  cli: {
    migrationsDir: __dirname + '/stage_migrations/',
  },
  extra: {
    connectionLimit: 30,
  },
};

export default new DataSource(stageDbConfig as DataSourceOptions);

