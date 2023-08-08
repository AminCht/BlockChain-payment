import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1691494029592 implements MigrationInterface {
    name = 'DevMigrations1691494029592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_Transctions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" integer NOT NULL, "network" varchar NOT NULL, "currency" varchar NOT NULL, "wallet_balance_before" double NOT NULL, "wallet_balance_after" double NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "expireTime" datetime NOT NULL, "walletId" integer, CONSTRAINT "REL_531ef47a3dd72d14cb1ef2a93b" UNIQUE ("walletId"))`);
        await queryRunner.query(`INSERT INTO "temporary_Transctions"("id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId") SELECT "id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId" FROM "Transctions"`);
        await queryRunner.query(`DROP TABLE "Transctions"`);
        await queryRunner.query(`ALTER TABLE "temporary_Transctions" RENAME TO "Transctions"`);
        await queryRunner.query(`CREATE TABLE "Wallets" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" varchar NOT NULL, "private_key" varchar NOT NULL, "wallet_network" varchar NOT NULL, "type" varchar NOT NULL, "lock" boolean NOT NULL DEFAULT (0), "status" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_b4f4eb0f6ea306e6bd8b3b71b9a" UNIQUE ("address"), CONSTRAINT "UQ_e61467f4042c97270174fe080e2" UNIQUE ("private_key"))`);
        await queryRunner.query(`CREATE TABLE "temporary_Transctions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" integer NOT NULL, "network" varchar NOT NULL, "currency" varchar NOT NULL, "wallet_balance_before" double NOT NULL, "wallet_balance_after" double NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "expireTime" datetime NOT NULL, "walletId" integer, CONSTRAINT "REL_531ef47a3dd72d14cb1ef2a93b" UNIQUE ("walletId"))`);
        await queryRunner.query(`INSERT INTO "temporary_Transctions"("id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId") SELECT "id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId" FROM "Transctions"`);
        await queryRunner.query(`DROP TABLE "Transctions"`);
        await queryRunner.query(`ALTER TABLE "temporary_Transctions" RENAME TO "Transctions"`);
        await queryRunner.query(`CREATE TABLE "temporary_Transctions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" integer NOT NULL, "network" varchar NOT NULL, "currency" varchar NOT NULL, "wallet_balance_before" double NOT NULL, "wallet_balance_after" double NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "expireTime" datetime NOT NULL, "walletId" integer, CONSTRAINT "REL_531ef47a3dd72d14cb1ef2a93b" UNIQUE ("walletId"), CONSTRAINT "FK_531ef47a3dd72d14cb1ef2a93ba" FOREIGN KEY ("walletId") REFERENCES "Wallets" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Transctions"("id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId") SELECT "id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId" FROM "Transctions"`);
        await queryRunner.query(`DROP TABLE "Transctions"`);
        await queryRunner.query(`ALTER TABLE "temporary_Transctions" RENAME TO "Transctions"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transctions" RENAME TO "temporary_Transctions"`);
        await queryRunner.query(`CREATE TABLE "Transctions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" integer NOT NULL, "network" varchar NOT NULL, "currency" varchar NOT NULL, "wallet_balance_before" double NOT NULL, "wallet_balance_after" double NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "expireTime" datetime NOT NULL, "walletId" integer, CONSTRAINT "REL_531ef47a3dd72d14cb1ef2a93b" UNIQUE ("walletId"))`);
        await queryRunner.query(`INSERT INTO "Transctions"("id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId") SELECT "id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId" FROM "temporary_Transctions"`);
        await queryRunner.query(`DROP TABLE "temporary_Transctions"`);
        await queryRunner.query(`ALTER TABLE "Transctions" RENAME TO "temporary_Transctions"`);
        await queryRunner.query(`CREATE TABLE "Transctions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" integer NOT NULL, "network" varchar NOT NULL, "currency" varchar NOT NULL, "wallet_balance_before" double NOT NULL, "wallet_balance_after" double NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "expireTime" datetime NOT NULL, "walletId" integer, CONSTRAINT "REL_531ef47a3dd72d14cb1ef2a93b" UNIQUE ("walletId"))`);
        await queryRunner.query(`INSERT INTO "Transctions"("id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId") SELECT "id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId" FROM "temporary_Transctions"`);
        await queryRunner.query(`DROP TABLE "temporary_Transctions"`);
        await queryRunner.query(`DROP TABLE "Wallets"`);
        await queryRunner.query(`ALTER TABLE "Transctions" RENAME TO "temporary_Transctions"`);
        await queryRunner.query(`CREATE TABLE "Transctions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "amount" integer NOT NULL, "network" varchar NOT NULL, "currency" varchar NOT NULL, "wallet_balance_before" double NOT NULL, "wallet_balance_after" double NOT NULL, "createdDate" datetime NOT NULL DEFAULT (datetime('now')), "expireTime" datetime NOT NULL, "walletId" integer, CONSTRAINT "REL_531ef47a3dd72d14cb1ef2a93b" UNIQUE ("walletId"), CONSTRAINT "FK_531ef47a3dd72d14cb1ef2a93ba" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "Transctions"("id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId") SELECT "id", "amount", "network", "currency", "wallet_balance_before", "wallet_balance_after", "createdDate", "expireTime", "walletId" FROM "temporary_Transctions"`);
        await queryRunner.query(`DROP TABLE "temporary_Transctions"`);
    }

}
