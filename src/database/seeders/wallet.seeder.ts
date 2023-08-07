import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
export class WalletSeeder implements Seeder{
    track?: boolean;
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager, connection:Connection): Promise<any> {
        console.log("1")
    }

}