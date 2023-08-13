import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1691835389595 implements MigrationInterface {
    name = 'DevMigrations1691835389595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Wallets" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "private_key" character varying NOT NULL, "wallet_network" character varying NOT NULL, "type" character varying NOT NULL, "lock" boolean NOT NULL DEFAULT false, "status" boolean NOT NULL DEFAULT '1', CONSTRAINT "UQ_b4f4eb0f6ea306e6bd8b3b71b9a" UNIQUE ("address"), CONSTRAINT "UQ_e61467f4042c97270174fe080e2" UNIQUE ("private_key"), CONSTRAINT "PK_22643866c3dcd5442c341d43b67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Transactions" ("id" SERIAL NOT NULL, "amount" character varying NOT NULL, "network" character varying NOT NULL, "currency" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', "wallet_balance_before" character varying NOT NULL, "wallet_balance_after" character varying, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "expireTime" TIMESTAMP NOT NULL, "walletId" integer, CONSTRAINT "PK_7761bf9766670b894ff2fdb3700" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_414209d0c639b5b4288ff00cd23" FOREIGN KEY ("walletId") REFERENCES "Wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_414209d0c639b5b4288ff00cd23"`);
        await queryRunner.query(`DROP TABLE "Transactions"`);
        await queryRunner.query(`DROP TABLE "Wallets"`);
    }

}
