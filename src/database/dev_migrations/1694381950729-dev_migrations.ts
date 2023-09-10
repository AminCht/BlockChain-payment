import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1694381950729 implements MigrationInterface {
    name = 'DevMigrations1694381950729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Withdraws" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "Withdraws" DROP COLUMN "network"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP COLUMN "createdDate"`);
        await queryRunner.query(`ALTER TABLE "Withdraws" ADD "currencyId" integer`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD "created_date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."Transactions_status_enum"`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD "status" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Withdraws" ADD CONSTRAINT "FK_abafdd7c410bb77c82a4b23de08" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Withdraws" DROP CONSTRAINT "FK_abafdd7c410bb77c82a4b23de08"`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."Transactions_status_enum" AS ENUM('Pending', 'Successful', 'Failed')`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD "status" "public"."Transactions_status_enum" NOT NULL DEFAULT 'Pending'`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP COLUMN "created_date"`);
        await queryRunner.query(`ALTER TABLE "Withdraws" DROP COLUMN "currencyId"`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD "createdDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Withdraws" ADD "network" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Withdraws" ADD "token" character varying NOT NULL`);
    }

}
