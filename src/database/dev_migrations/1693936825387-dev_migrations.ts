import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1693936825387 implements MigrationInterface {
    name = 'DevMigrations1693936825387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transactions" RENAME COLUMN "createdDate" TO "created_date"`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Withdraws" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "Withdraws" ADD "status" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Withdraws" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "Withdraws" ADD "status" character varying NOT NULL DEFAULT 'Pending'`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Transactions" RENAME COLUMN "created_date" TO "createdDate"`);
    }

}
