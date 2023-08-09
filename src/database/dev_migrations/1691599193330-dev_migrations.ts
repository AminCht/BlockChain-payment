import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1691599193330 implements MigrationInterface {
    name = 'DevMigrations1691599193330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Transctions" DROP COLUMN "wallet_balance_before"`);
        await queryRunner.query(`ALTER TABLE "Transctions" ADD "wallet_balance_before" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Transctions" DROP COLUMN "wallet_balance_after"`);
        await queryRunner.query(`ALTER TABLE "Transctions" ADD "wallet_balance_after" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transctions" DROP COLUMN "wallet_balance_after"`);
        await queryRunner.query(`ALTER TABLE "Transctions" ADD "wallet_balance_after" numeric`);
        await queryRunner.query(`ALTER TABLE "Transctions" DROP COLUMN "wallet_balance_before"`);
        await queryRunner.query(`ALTER TABLE "Transctions" ADD "wallet_balance_before" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
    }

}
