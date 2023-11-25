import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1697724134949 implements MigrationInterface {
    name = 'DevMigrations1697724134949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tickets" ADD "status" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "Tickets" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Tickets" ADD CONSTRAINT "FK_f2074c269d97f7a06dda867c964" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tickets" DROP CONSTRAINT "FK_f2074c269d97f7a06dda867c964"`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Tickets" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "Tickets" DROP COLUMN "status"`);
    }

}
