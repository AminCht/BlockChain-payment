import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1697743631638 implements MigrationInterface {
    name = 'DevMigrations1697743631638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Messages" RENAME COLUMN "recieverId" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Messages" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "Messages" ADD "createdAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Messages" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "Messages" ADD "createdAt" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Messages" RENAME COLUMN "createdAt" TO "recieverId"`);
    }

}
