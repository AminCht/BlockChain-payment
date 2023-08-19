import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1692466435053 implements MigrationInterface {
    name = 'DevMigrations1692466435053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transactions" DROP COLUMN "network"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD "currencyId" integer`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "role" character varying NOT NULL DEFAULT 'User'`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_6909d45f9fe6ffb04b510d331c5" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_6909d45f9fe6ffb04b510d331c5"`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP COLUMN "currencyId"`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD "currency" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD "network" character varying NOT NULL`);
    }

}
