import { MigrationInterface, QueryRunner } from "typeorm";

export class DevMigrations1692715985958 implements MigrationInterface {
    name = 'DevMigrations1692715985958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "EndPointAcesses" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8cfa005a5b314b813316a70e060" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ApiKeys" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "status" boolean NOT NULL DEFAULT '1', "expireTime" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "UQ_4eb600e893e788b78bdc99fd2ce" UNIQUE ("key"), CONSTRAINT "PK_6afa488da2335c53025b9afde86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "apikey_endpoint" ("apiKeysId" integer NOT NULL, "endPointAcessesId" integer NOT NULL, CONSTRAINT "PK_4a5a0aab5c90be647786d2c533d" PRIMARY KEY ("apiKeysId", "endPointAcessesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b20e336573bcf5ed242aa029fa" ON "apikey_endpoint" ("apiKeysId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0196db49743fe826696ce083e6" ON "apikey_endpoint" ("endPointAcessesId") `);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" ADD CONSTRAINT "FK_85cd0d8a55b8c8682bdaae88f80" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apikey_endpoint" ADD CONSTRAINT "FK_b20e336573bcf5ed242aa029fa2" FOREIGN KEY ("apiKeysId") REFERENCES "ApiKeys"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "apikey_endpoint" ADD CONSTRAINT "FK_0196db49743fe826696ce083e69" FOREIGN KEY ("endPointAcessesId") REFERENCES "EndPointAcesses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apikey_endpoint" DROP CONSTRAINT "FK_0196db49743fe826696ce083e69"`);
        await queryRunner.query(`ALTER TABLE "apikey_endpoint" DROP CONSTRAINT "FK_b20e336573bcf5ed242aa029fa2"`);
        await queryRunner.query(`ALTER TABLE "ApiKeys" DROP CONSTRAINT "FK_85cd0d8a55b8c8682bdaae88f80"`);
        await queryRunner.query(`ALTER TABLE "Wallets" ALTER COLUMN "status" SET DEFAULT true`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0196db49743fe826696ce083e6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b20e336573bcf5ed242aa029fa"`);
        await queryRunner.query(`DROP TABLE "apikey_endpoint"`);
        await queryRunner.query(`DROP TABLE "ApiKeys"`);
        await queryRunner.query(`DROP TABLE "EndPointAcesses"`);
    }

}
