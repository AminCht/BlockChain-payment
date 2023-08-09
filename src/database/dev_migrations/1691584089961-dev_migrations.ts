import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1691584089961 implements MigrationInterface {
    name = 'DevMigrations1691584089961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Transctions" ALTER COLUMN "wallet_balance_before" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "Transctions" ALTER COLUMN "wallet_balance_after" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transctions" ALTER COLUMN "wallet_balance_after" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "Transctions" ALTER COLUMN "wallet_balance_before" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
    }

}
