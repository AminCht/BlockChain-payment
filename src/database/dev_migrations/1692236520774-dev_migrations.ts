import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1692236520774 implements MigrationInterface {
    name = 'DevMigrations1692236520774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Tokens" ("id" SERIAL NOT NULL, "network" character varying NOT NULL, "currency" character varying NOT NULL, "wallet_network" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_bab3de085902db0e7379bd3ca39" UNIQUE ("network"), CONSTRAINT "UQ_85ad54dc7ff8e888502ace6d2bf" UNIQUE ("currency"), CONSTRAINT "PK_47b543436b0189860e4e01c7e14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tokens_users" ("tokensId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_6aa552afbf2af976b8dea21e2d5" PRIMARY KEY ("tokensId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cf7d4b6f29b5be5cf9b61cb658" ON "tokens_users" ("tokensId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f32547f352e424f1a31effb31b" ON "tokens_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "updatedAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tokens_users" ADD CONSTRAINT "FK_cf7d4b6f29b5be5cf9b61cb6583" FOREIGN KEY ("tokensId") REFERENCES "Tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tokens_users" ADD CONSTRAINT "FK_f32547f352e424f1a31effb31b7" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens_users" DROP CONSTRAINT "FK_f32547f352e424f1a31effb31b7"`);
        await queryRunner.query(`ALTER TABLE "tokens_users" DROP CONSTRAINT "FK_cf7d4b6f29b5be5cf9b61cb6583"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "updatedAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f32547f352e424f1a31effb31b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cf7d4b6f29b5be5cf9b61cb658"`);
        await queryRunner.query(`DROP TABLE "tokens_users"`);
        await queryRunner.query(`DROP TABLE "Tokens"`);
    }

}
