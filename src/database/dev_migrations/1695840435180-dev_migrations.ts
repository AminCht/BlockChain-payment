import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1695840435180 implements MigrationInterface {
    name = 'DevMigrations1695840435180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "currencies" ALTER COLUMN "decimals" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "currencies" ALTER COLUMN "decimals" SET DEFAULT '18'`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
    }

}
