import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1693417877872 implements MigrationInterface {
    name = 'DevMigrations1693417877872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Withdraws" ("id" SERIAL NOT NULL, "status" integer NOT NULL DEFAULT '1', "amount" character varying NOT NULL, "token" character varying NOT NULL, "network" character varying NOT NULL, "dst_wallet" character varying NOT NULL, "tx_hash" character varying, "tx_url" character varying, "created_At" TIMESTAMP NOT NULL, "updated_At" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_5e338a7a32dc560edbe9944ba5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Withdraws" ADD CONSTRAINT "FK_794e804111b106b0ff6aeb94718" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Withdraws" DROP CONSTRAINT "FK_794e804111b106b0ff6aeb94718"`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`DROP TABLE "Withdraws"`);
    }

}
