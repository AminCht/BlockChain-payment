import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1692695590266 implements MigrationInterface {
    name = 'DevMigrations1692695590266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "EndPointAcesses" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "EndPointAcesses" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "EndPointAcesses" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "EndPointAcesses" ADD "name" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
    }

}
