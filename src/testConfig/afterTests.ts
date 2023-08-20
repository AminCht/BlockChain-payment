import { DataSource } from 'typeorm';
const teardown = async () => {
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: false,
        dropSchema: false,
        entities: [__dirname + '/entities/*.entity{.js,.ts}'],
    });
   //await dataSource.initialize();
    //await dataSource.dropDatabase();
};

module.exports = teardown;
