import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1692184310005 implements MigrationInterface {
    name = 'DevMigrations1692184310005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Wallets" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "private_key" character varying NOT NULL, "wallet_network" character varying NOT NULL, "type" character varying NOT NULL, "lock" boolean NOT NULL DEFAULT false, "status" boolean NOT NULL DEFAULT '1', CONSTRAINT "UQ_b4f4eb0f6ea306e6bd8b3b71b9a" UNIQUE ("address"), CONSTRAINT "UQ_e61467f4042c97270174fe080e2" UNIQUE ("private_key"), CONSTRAINT "PK_22643866c3dcd5442c341d43b67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Transactions" ("id" SERIAL NOT NULL, "amount" character varying NOT NULL, "network" character varying NOT NULL, "currency" character varying NOT NULL, "status" "public"."Transactions_status_enum" NOT NULL DEFAULT 'Pending', "wallet_balance_before" character varying NOT NULL, "wallet_balance_after" character varying, "createdDate" TIMESTAMP NOT NULL, "expireTime" TIMESTAMP NOT NULL, "walletId" integer, "userId" integer, CONSTRAINT "PK_7761bf9766670b894ff2fdb3700" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Tokens" ("id" SERIAL NOT NULL, "network" character varying NOT NULL, "currency" character varying NOT NULL, "wallet_network" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_bab3de085902db0e7379bd3ca39" UNIQUE ("network"), CONSTRAINT "UQ_85ad54dc7ff8e888502ace6d2bf" UNIQUE ("currency"), CONSTRAINT "PK_47b543436b0189860e4e01c7e14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tokens_users" ("tokensId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_6aa552afbf2af976b8dea21e2d5" PRIMARY KEY ("tokensId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cf7d4b6f29b5be5cf9b61cb658" ON "tokens_users" ("tokensId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f32547f352e424f1a31effb31b" ON "tokens_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_414209d0c639b5b4288ff00cd23" FOREIGN KEY ("walletId") REFERENCES "Wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_f01450fedf7507118ad25dcf41e" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokens_users" ADD CONSTRAINT "FK_cf7d4b6f29b5be5cf9b61cb6583" FOREIGN KEY ("tokensId") REFERENCES "Tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tokens_users" ADD CONSTRAINT "FK_f32547f352e424f1a31effb31b7" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens_users" DROP CONSTRAINT "FK_f32547f352e424f1a31effb31b7"`);
        await queryRunner.query(`ALTER TABLE "tokens_users" DROP CONSTRAINT "FK_cf7d4b6f29b5be5cf9b61cb6583"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_f01450fedf7507118ad25dcf41e"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_414209d0c639b5b4288ff00cd23"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f32547f352e424f1a31effb31b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cf7d4b6f29b5be5cf9b61cb658"`);
        await queryRunner.query(`DROP TABLE "tokens_users"`);
        await queryRunner.query(`DROP TABLE "Tokens"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "Transactions"`);
        await queryRunner.query(`DROP TABLE "Wallets"`);
    }

}
