import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMigrations1692224916614 implements MigrationInterface {
    name = 'TestMigrations1692224916614'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
    }

}
