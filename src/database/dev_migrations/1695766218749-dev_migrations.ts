import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1695766218749 implements MigrationInterface {
    name = 'DevMigrations1695766218749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transactions" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP COLUMN "description"`);
    }

}
