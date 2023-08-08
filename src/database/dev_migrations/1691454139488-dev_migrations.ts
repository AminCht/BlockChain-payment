import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1691454139488 implements MigrationInterface {
    name = 'DevMigrations1691454139488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallet" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" varchar NOT NULL, "private_key" varchar NOT NULL, "wallet_network" varchar NOT NULL, "type" varchar NOT NULL, "lock" boolean NOT NULL, "status" boolean NOT NULL, CONSTRAINT "UQ_1dcc9f5fd49e3dc52c6d2393c53" UNIQUE ("address"), CONSTRAINT "UQ_fa01434eca82fdd4bb4dfb87182" UNIQUE ("private_key"))`);
        await queryRunner.query(`CREATE TABLE "Transctions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" integer NOT NULL, "network" varchar NOT NULL, "currency" varchar NOT NULL, "wallet_balance_before" double NOT NULL, "wallet_balance_after" double NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "expireTime" datetime NOT NULL, "walletId" integer, CONSTRAINT "REL_531ef47a3dd72d14cb1ef2a93b" UNIQUE ("walletId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_Transctions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" integer NOT NULL, "network" varchar NOT NULL, "currency" varchar NOT NULL, "wallet_balance_before" double NOT NULL, "wallet_balance_after" double NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "expireTime" datetime NOT NULL, "walletId" integer, CONSTRAINT "REL_531ef47a3dd72d14cb1ef2a93b" UNIQUE ("walletId"), CONSTRAINT "FK_531ef47a3dd72d14cb1ef2a93ba" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Transctions"("id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId") SELECT "id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId" FROM "Transctions"`);
        await queryRunner.query(`DROP TABLE "Transctions"`);
        await queryRunner.query(`ALTER TABLE "temporary_Transctions" RENAME TO "Transctions"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transctions" RENAME TO "temporary_Transctions"`);
        await queryRunner.query(`CREATE TABLE "Transctions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" integer NOT NULL, "network" varchar NOT NULL, "currency" varchar NOT NULL, "wallet_balance_before" double NOT NULL, "wallet_balance_after" double NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "expireTime" datetime NOT NULL, "walletId" integer, CONSTRAINT "REL_531ef47a3dd72d14cb1ef2a93b" UNIQUE ("walletId"))`);
        await queryRunner.query(`INSERT INTO "Transctions"("id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId") SELECT "id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId" FROM "temporary_Transctions"`);
        await queryRunner.query(`DROP TABLE "temporary_Transctions"`);
        await queryRunner.query(`DROP TABLE "Transctions"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
    }

}
