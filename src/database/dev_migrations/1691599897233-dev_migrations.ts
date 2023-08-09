import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1691599897233 implements MigrationInterface {
    name = 'DevMigrations1691599897233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Transctions" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "Transctions" ADD "amount" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transctions" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "Transctions" ADD "amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
    }

}
