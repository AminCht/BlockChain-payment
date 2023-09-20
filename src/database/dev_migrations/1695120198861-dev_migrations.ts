import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1695120198861 implements MigrationInterface {
    name = 'DevMigrations1695120198861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Wallets" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "private_key" character varying NOT NULL, "wallet_network" character varying NOT NULL, "type" character varying NOT NULL, "lock" boolean NOT NULL DEFAULT false, "status" boolean NOT NULL DEFAULT '1', CONSTRAINT "UQ_b4f4eb0f6ea306e6bd8b3b71b9a" UNIQUE ("address"), CONSTRAINT "UQ_e61467f4042c97270174fe080e2" UNIQUE ("private_key"), CONSTRAINT "PK_22643866c3dcd5442c341d43b67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Withdraws" ("id" SERIAL NOT NULL, "status" integer NOT NULL DEFAULT '1', "amount" character varying NOT NULL, "dst_wallet" character varying NOT NULL, "tx_hash" character varying, "tx_url" character varying, "created_At" TIMESTAMP NOT NULL, "updated_At" TIMESTAMP NOT NULL, "userId" integer, "currencyId" integer, CONSTRAINT "PK_5e338a7a32dc560edbe9944ba5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currencies" ("id" SERIAL NOT NULL, "network" character varying NOT NULL, "name" character varying NOT NULL, "symbol" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "decimals" integer NOT NULL DEFAULT '18', "address" character varying NOT NULL, "CoinGeckoId" character varying, CONSTRAINT "UQ_71016f972669774c1ec89b266bd" UNIQUE ("network", "symbol"), CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Transactions" ("id" SERIAL NOT NULL, "amount" character varying NOT NULL, "status" integer NOT NULL DEFAULT '0', "wallet_balance_before" character varying NOT NULL, "wallet_balance_after" character varying, "created_date" TIMESTAMP NOT NULL, "expireTime" TIMESTAMP NOT NULL, "walletId" integer, "userId" integer, "currencyId" integer, CONSTRAINT "PK_7761bf9766670b894ff2fdb3700" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'User', "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "EndPointAcesses" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8cfa005a5b314b813316a70e060" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ApiKeys" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "status" boolean NOT NULL DEFAULT '1', "expireTime" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "UQ_4eb600e893e788b78bdc99fd2ce" UNIQUE ("key"), CONSTRAINT "PK_6afa488da2335c53025b9afde86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currency_user" ("currenciesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_ff10a169857b57c992b84d79288" PRIMARY KEY ("currenciesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fb9a5ea3c401ba6124b9940094" ON "currency_user" ("currenciesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b8b9c94bd2378f5616d3df600c" ON "currency_user" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "apikey_endpoint" ("apiKeysId" integer NOT NULL, "endPointAcessesId" integer NOT NULL, CONSTRAINT "PK_4a5a0aab5c90be647786d2c533d" PRIMARY KEY ("apiKeysId", "endPointAcessesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b20e336573bcf5ed242aa029fa" ON "apikey_endpoint" ("apiKeysId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0196db49743fe826696ce083e6" ON "apikey_endpoint" ("endPointAcessesId") `);
        await queryRunner.query(`ALTER TABLE "Withdraws" ADD CONSTRAINT "FK_794e804111b106b0ff6aeb94718" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Withdraws" ADD CONSTRAINT "FK_abafdd7c410bb77c82a4b23de08" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_414209d0c639b5b4288ff00cd23" FOREIGN KEY ("walletId") REFERENCES "Wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_f01450fedf7507118ad25dcf41e" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_6909d45f9fe6ffb04b510d331c5" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ADD CONSTRAINT "FK_85cd0d8a55b8c8682bdaae88f80" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "currency_user" ADD CONSTRAINT "FK_fb9a5ea3c401ba6124b99400940" FOREIGN KEY ("currenciesId") REFERENCES "currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "currency_user" ADD CONSTRAINT "FK_b8b9c94bd2378f5616d3df600c4" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apikey_endpoint" ADD CONSTRAINT "FK_b20e336573bcf5ed242aa029fa2" FOREIGN KEY ("apiKeysId") REFERENCES "ApiKeys"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "apikey_endpoint" ADD CONSTRAINT "FK_0196db49743fe826696ce083e69" FOREIGN KEY ("endPointAcessesId") REFERENCES "EndPointAcesses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apikey_endpoint" DROP CONSTRAINT "FK_0196db49743fe826696ce083e69"`);
        await queryRunner.query(`ALTER TABLE "apikey_endpoint" DROP CONSTRAINT "FK_b20e336573bcf5ed242aa029fa2"`);
        await queryRunner.query(`ALTER TABLE "currency_user" DROP CONSTRAINT "FK_b8b9c94bd2378f5616d3df600c4"`);
        await queryRunner.query(`ALTER TABLE "currency_user" DROP CONSTRAINT "FK_fb9a5ea3c401ba6124b99400940"`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" DROP CONSTRAINT "FK_85cd0d8a55b8c8682bdaae88f80"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_6909d45f9fe6ffb04b510d331c5"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_f01450fedf7507118ad25dcf41e"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_414209d0c639b5b4288ff00cd23"`);
        await queryRunner.query(`ALTER TABLE "Withdraws" DROP CONSTRAINT "FK_abafdd7c410bb77c82a4b23de08"`);
        await queryRunner.query(`ALTER TABLE "Withdraws" DROP CONSTRAINT "FK_794e804111b106b0ff6aeb94718"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0196db49743fe826696ce083e6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b20e336573bcf5ed242aa029fa"`);
        await queryRunner.query(`DROP TABLE "apikey_endpoint"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8b9c94bd2378f5616d3df600c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb9a5ea3c401ba6124b9940094"`);
        await queryRunner.query(`DROP TABLE "currency_user"`);
        await queryRunner.query(`DROP TABLE "ApiKeys"`);
        await queryRunner.query(`DROP TABLE "EndPointAcesses"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "Transactions"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
        await queryRunner.query(`DROP TABLE "Withdraws"`);
        await queryRunner.query(`DROP TABLE "Wallets"`);
    }

}
