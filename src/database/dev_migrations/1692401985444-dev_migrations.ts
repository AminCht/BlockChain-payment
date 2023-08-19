import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1692401985444 implements MigrationInterface {
    name = 'DevMigrations1692401985444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Wallets" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "private_key" character varying NOT NULL, "wallet_network" character varying NOT NULL, "type" character varying NOT NULL, "lock" boolean NOT NULL DEFAULT false, "status" boolean NOT NULL DEFAULT '1', CONSTRAINT "UQ_b4f4eb0f6ea306e6bd8b3b71b9a" UNIQUE ("address"), CONSTRAINT "UQ_e61467f4042c97270174fe080e2" UNIQUE ("private_key"), CONSTRAINT "PK_22643866c3dcd5442c341d43b67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Transactions" ("id" SERIAL NOT NULL, "amount" character varying NOT NULL, "network" character varying NOT NULL, "currency" character varying NOT NULL, "status" "public"."Transactions_status_enum" NOT NULL DEFAULT 'Pending', "wallet_balance_before" character varying NOT NULL, "wallet_balance_after" character varying, "createdDate" TIMESTAMP NOT NULL, "expireTime" TIMESTAMP NOT NULL, "walletId" integer, "userId" integer, CONSTRAINT "PK_7761bf9766670b894ff2fdb3700" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currencies" ("id" SERIAL NOT NULL, "network" character varying NOT NULL, "name" character varying NOT NULL, "symbol" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_71016f972669774c1ec89b266bd" UNIQUE ("network", "symbol"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currency_user" ("currenciesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_ff10a169857b57c992b84d79288" PRIMARY KEY ("currenciesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fb9a5ea3c401ba6124b9940094" ON "currency_user" ("currenciesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b8b9c94bd2378f5616d3df600c" ON "currency_user" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_414209d0c639b5b4288ff00cd23" FOREIGN KEY ("walletId") REFERENCES "Wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_f01450fedf7507118ad25dcf41e" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "currency_user" ADD CONSTRAINT "FK_fb9a5ea3c401ba6124b99400940" FOREIGN KEY ("currenciesId") REFERENCES "currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "currency_user" ADD CONSTRAINT "FK_b8b9c94bd2378f5616d3df600c4" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "currency_user" DROP CONSTRAINT "FK_b8b9c94bd2378f5616d3df600c4"`);
        await queryRunner.query(`ALTER TABLE "currency_user" DROP CONSTRAINT "FK_fb9a5ea3c401ba6124b99400940"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_f01450fedf7507118ad25dcf41e"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_414209d0c639b5b4288ff00cd23"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8b9c94bd2378f5616d3df600c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb9a5ea3c401ba6124b9940094"`);
        await queryRunner.query(`DROP TABLE "currency_user"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "Transactions"`);
        await queryRunner.query(`DROP TABLE "Wallets"`);
    }

}
